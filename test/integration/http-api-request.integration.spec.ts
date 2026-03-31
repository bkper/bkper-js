import { expect } from "chai";
import {
  Bkper,
  BkperError,
  Book,
  Config,
  Transaction,
} from "../../src/index.js";
import {
  createIntegrationConfig,
  createReadyTestBook,
  deleteTestBook,
  getForbiddenBookId,
  getLocalApiUrl,
  isApiAvailable,
  seedBasicAccounts,
  uniqueTestName,
} from "./helpers.js";

describe("http-api-request integration", function () {
  this.timeout(120000);

  before(async function () {
    const available = await isApiAvailable();
    if (!available) {
      console.log(`Skipping integration tests: API not available at ${getLocalApiUrl()}`);
      this.skip();
    }
  });

  it("should create a book, seed accounts, create a transaction, and list it without retries", async function () {
    const retryAttempts: number[] = [];
    const config = await createIntegrationConfig({
      requestRetryHandler: async (_status, _error, attempt) => {
        if (attempt !== undefined) {
          retryAttempts.push(attempt);
        }
      },
    });

    let book: Book | undefined;
    try {
      book = await createReadyTestBook(uniqueTestName("bkper-js-http-smoke"));
      const seededBook = new Book(book.json(), config);
      const { cash, revenue } = await seedBasicAccounts(seededBook);

      const createdTransaction = await new Transaction(seededBook)
        .setDate("2025-01-15")
        .setAmount("100")
        .setDescription("Integration smoke transaction")
        .from(revenue)
        .to(cash)
        .create();

      const transactions = await seededBook.listTransactions("");

      expect(createdTransaction.getId()).to.be.a("string");
      expect(transactions.size()).to.be.greaterThanOrEqual(1);
      expect(
        transactions
          .getItems()
          .some(tx => tx.getDescription() === "Integration smoke transaction")
      ).to.equal(true);
      expect(retryAttempts).to.deep.equal([]);
    } finally {
      await deleteTestBook(book);
    }
  });

  it("should fail fast on a missing or forbidden book without retrying", async function () {
    const retryAttempts: number[] = [];
    const bkper = new Bkper(
      await createIntegrationConfig({
        requestRetryHandler: async (_status, _error, attempt) => {
          if (attempt !== undefined) {
            retryAttempts.push(attempt);
          }
        },
      })
    );

    const forbiddenBook = new Book(
      { id: getForbiddenBookId() },
      bkper.getConfig()
    );

    try {
      await forbiddenBook.listTransactions("");
      expect.fail("Expected listTransactions to throw");
    } catch (error) {
      expect(error).to.be.instanceOf(BkperError);
      if (!(error instanceof BkperError)) {
        throw error;
      }
      expect([401, 404]).to.include(error.code);
      expect(error.message.toLowerCase()).to.satisfy((message: string) => {
        return message.includes("collaborator") || message.includes("not found");
      });
    }

    expect(retryAttempts).to.deep.equal([]);
  });

  it("should fail fast on a 400 validation error without retrying", async function () {
    const retryAttempts: number[] = [];
    const config = await createIntegrationConfig({
      requestRetryHandler: async (_status, _error, attempt) => {
        if (attempt !== undefined) {
          retryAttempts.push(attempt);
        }
      },
    });

    const invalidBook = new Book({ name: "invalid-book" }, config);
    Reflect.set(invalidBook.payload, "decimalSeparator", "BAD");

    try {
      await invalidBook.create();
      expect.fail("Expected invalid book payload to throw");
    } catch (error) {
      expect(error).to.be.instanceOf(BkperError);
      if (!(error instanceof BkperError)) {
        throw error;
      }
      expect(error.code).to.equal(400);
      expect(error.message).to.contain("InvalidFormatException");
    }

    expect(retryAttempts).to.deep.equal([]);
  });

  it("should retry technical network failures and expose the original error to retry handlers", async function () {
    const retries: Array<{ status?: number; error?: unknown; attempt?: number }> = [];
    const unreachableConfig: Config = {
      apiBaseUrl: "http://localhost:65534/_ah/api/bkper",
      oauthTokenProvider: async () => "test-token",
      requestRetryHandler: async (status, error, attempt) => {
        retries.push({ status, error, attempt });
      },
    };

    const bkper = new Bkper(unreachableConfig);

    try {
      await bkper.getBooks();
      expect.fail("Expected network failure to throw");
    } catch (error) {
      expect(error).to.be.instanceOf(BkperError);
      if (!(error instanceof BkperError)) {
        throw error;
      }
      expect(error.message).to.contain("Network error calling v5/books");
    }

    expect(retries).to.have.length(3);
    expect(retries.map(retry => retry.status)).to.deep.equal([520, 520, 520]);
    expect(retries.map(retry => retry.attempt)).to.deep.equal([1, 2, 3]);
    retries.forEach(retry => {
      expect(retry.error).to.be.instanceOf(Error);
    });
  });
});
