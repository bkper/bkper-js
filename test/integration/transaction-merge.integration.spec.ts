import { expect } from "chai";
import {
  Account,
  BkperError,
  Book,
  File,
  Transaction,
} from "../../src/index.js";
import {
  createIntegrationConfig,
  createReadyTestBook,
  deleteTestBook,
  getIntegrationApiUrl,
  isApiAvailable,
  seedBasicAccounts,
  uniqueTestName,
} from "./helpers.js";

function requiredId(resource: { getId(): string | undefined }): string {
  const id = resource.getId();
  if (!id) {
    throw new Error("Expected persisted test resource to have an id");
  }
  return id;
}

async function expectBkperError(
  operation: () => Promise<unknown>,
  code: number,
  messagePart: string
): Promise<BkperError> {
  try {
    await operation();
    expect.fail("Expected operation to throw");
  } catch (error) {
    expect(error).to.be.instanceOf(BkperError);
    if (!(error instanceof BkperError)) {
      throw error;
    }
    expect(error.code).to.equal(code);
    expect(error.message.toLowerCase()).to.contain(messagePart.toLowerCase());
    return error;
  }
}

async function waitUntilTrashed(book: Book, transactionIds: string[]): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt++) {
    const transactions = await Promise.all(
      transactionIds.map(id => book.getTransaction(id))
    );
    if (transactions.every(transaction => transaction?.isTrashed() === true)) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  expect.fail(`Source transactions were not trashed: ${transactionIds.join(", ")}`);
}

async function createFile(book: Book, name: string): Promise<File> {
  return await new File(book)
    .setName(name)
    .setContentType("text/plain")
    .setContent(Buffer.from(name).toString("base64"))
    .create();
}

function setMetadata(
  transaction: Transaction,
  properties: { [key: string]: string },
  remoteId: string,
  url: string,
  file?: File
): Transaction {
  transaction.setProperties(properties).addRemoteId(remoteId).addUrl(url);
  if (file) {
    transaction.addFile(file);
  }
  return transaction;
}

describe("transaction merge deployed API integration", function () {
  this.timeout(180000);

  let book: Book | undefined;
  let testBook: Book;
  let cash: Account;
  let revenue: Account;
  let expenses: Account;

  before(async function () {
    if (!(await isApiAvailable())) {
      console.log(`Skipping integration tests: API not available at ${getIntegrationApiUrl()}`);
      this.skip();
    }

    const config = await createIntegrationConfig();
    book = await createReadyTestBook(uniqueTestName("bkper-js-merge-e2e"));
    testBook = new Book(book.json(), config);
    ({ cash, revenue, expenses } = await seedBasicAccounts(testBook));
  });

  after(async function () {
    await deleteTestBook(book);
  });

  it("forwards overrides, preserves ordered precedence, and cleans up sources", async function () {
    const runId = uniqueTestName("merge");
    const persistedPrimaryFile = await createFile(testBook, `${runId}-persisted-primary.txt`);
    const persistedSecondaryFile = await createFile(testBook, `${runId}-persisted-secondary.txt`);
    const submittedPrimaryFile = await createFile(testBook, `${runId}-submitted-primary.txt`);
    const submittedSecondaryFile = await createFile(testBook, `${runId}-submitted-secondary.txt`);

    const primary = setMetadata(
      new Transaction(testBook)
        .setDate("2026-08-01")
        .setAmount("10")
        .setDescription("persisted primary")
        .from(revenue)
        .to(cash),
      { conflict: "persisted-primary", persisted_primary: "one" },
      `${runId}-persisted-primary`,
      `https://example.com/${runId}/persisted-primary`,
      persistedPrimaryFile
    );
    await primary.post();

    const secondary = setMetadata(
      new Transaction(testBook)
        .setDate("2026-08-02")
        .setAmount("20")
        .setDescription("persisted secondary")
        .from(cash)
        .to(expenses),
      { conflict: "persisted-secondary", persisted_secondary: "two" },
      `${runId}-persisted-secondary`,
      `https://example.com/${runId}/persisted-secondary`,
      persistedSecondaryFile
    );
    await secondary.create();

    const primaryId = requiredId(primary);
    const secondaryId = requiredId(secondary);
    const merged = await testBook.mergeTransactions(
      {
        id: primaryId,
        amount: "30.00",
        date: "2026-08-03",
        creditAccount: { id: requiredId(cash) },
        debitAccount: { id: requiredId(expenses) },
        description: "submitted primary",
        files: [submittedPrimaryFile.json()],
        properties: {
          conflict: "submitted-primary",
          submitted_primary: "three",
        },
        remoteIds: [`${runId}-submitted-primary`],
        urls: [`https://example.com/${runId}/submitted-primary`],
      },
      {
        id: secondaryId,
        amount: "40.00",
        date: "2026-08-04",
        creditAccount: { id: requiredId(revenue) },
        debitAccount: { id: requiredId(cash) },
        description: "submitted secondary",
        files: [submittedSecondaryFile.json()],
        properties: {
          conflict: "submitted-secondary",
          submitted_secondary: "four",
        },
        remoteIds: [`${runId}-submitted-secondary`],
        urls: [`https://example.com/${runId}/submitted-secondary`],
      }
    );

    const mergedId = requiredId(merged);
    expect(mergedId).to.not.equal(primaryId);
    expect(mergedId).to.not.equal(secondaryId);
    expect(merged.getAmount()?.eq(30)).to.equal(true);
    expect(merged.getDate()).to.equal("2026-08-03");
    expect(merged.getDescription()).to.equal("submitted primary");
    expect(merged.json().creditAccount?.id).to.equal(requiredId(cash));
    expect(merged.json().debitAccount?.id).to.equal(requiredId(expenses));
    expect(merged.isPosted()).to.equal(true);
    expect(merged.isChecked()).to.equal(false);

    expect(merged.getProperties()).to.deep.equal({
      conflict: "submitted-primary",
      persisted_primary: "one",
      persisted_secondary: "two",
      submitted_primary: "three",
      submitted_secondary: "four",
    });

    expect(new Set(merged.getFiles().map(file => requiredId(file)))).to.deep.equal(
      new Set([
        requiredId(persistedPrimaryFile),
        requiredId(persistedSecondaryFile),
        requiredId(submittedPrimaryFile),
        requiredId(submittedSecondaryFile),
      ])
    );

    expect(merged.getRemoteIds()).to.include.members([
      `${runId}-persisted-primary`,
      `${runId}-persisted-secondary`,
      `${runId}-submitted-primary`,
      `${runId}-submitted-secondary`,
      `merged_${primaryId}`,
      `merged_${secondaryId}`,
    ]);
    expect(merged.getUrls()).to.include.members([
      `https://example.com/${runId}/persisted-primary`,
      `https://example.com/${runId}/persisted-secondary`,
      `https://example.com/${runId}/submitted-primary`,
      `https://example.com/${runId}/submitted-secondary`,
    ]);

    const fetchedMerged = await testBook.getTransaction(mergedId);
    expect(fetchedMerged?.getId()).to.equal(mergedId);
    expect(fetchedMerged?.getAmount()?.eq(30)).to.equal(true);
    expect(fetchedMerged?.getProperties()).to.deep.equal(merged.getProperties());
    expect(
      new Set(fetchedMerged?.getFiles().map(file => requiredId(file)))
    ).to.deep.equal(new Set(merged.getFiles().map(file => requiredId(file))));
    await waitUntilTrashed(testBook, [primaryId, secondaryId]);
  });

  it("falls back from blank primary scalars to submitted secondary values", async function () {
    const primary = await new Transaction(testBook)
      .setDescription("persisted blank-test primary")
      .create();
    const secondary = await new Transaction(testBook)
      .setDescription("persisted blank-test secondary")
      .create();

    const primaryId = requiredId(primary);
    const secondaryId = requiredId(secondary);
    const merged = await testBook.mergeTransactions(
      { id: primaryId, amount: " ", description: " " },
      {
        id: secondaryId,
        amount: "70.00",
        date: "2026-08-07",
        creditAccount: { id: requiredId(revenue) },
        debitAccount: { id: requiredId(expenses) },
        description: "submitted secondary fallback",
      }
    );

    expect(merged.getAmount()?.eq(70)).to.equal(true);
    expect(merged.getDate()).to.equal("2026-08-07");
    expect(merged.getDescription()).to.equal("submitted secondary fallback");
    expect(merged.json().creditAccount?.id).to.equal(requiredId(revenue));
    expect(merged.json().debitAccount?.id).to.equal(requiredId(expenses));
    expect(merged.isPosted()).to.equal(false);
    await waitUntilTrashed(testBook, [primaryId, secondaryId]);
  });

  it("rejects missing, duplicate, nonexistent, and invalid merge payloads", async function () {
    try {
      await testBook.mergeTransactions({ description: "missing id" }, "secondary-id");
      expect.fail("Expected missing id to throw");
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      if (!(error instanceof Error)) {
        throw error;
      }
      expect(error.message).to.equal(
        "The primary transaction must provide an id for merge."
      );
    }

    const first = await new Transaction(testBook)
      .setDescription("invalid merge first")
      .create();
    const second = await new Transaction(testBook)
      .setDescription("invalid merge second")
      .create();
    const firstId = requiredId(first);
    const secondId = requiredId(second);

    await expectBkperError(
      () => testBook.mergeTransactions(firstId, firstId),
      400,
      "distinct"
    );
    await expectBkperError(
      () => testBook.mergeTransactions(firstId, "nonexistent-transaction-id"),
      400,
      "not found"
    );
    await expectBkperError(
      () =>
        testBook.mergeTransactions(
          {
            id: firstId,
            creditAccount: { id: requiredId(cash) },
            debitAccount: { id: requiredId(cash) },
          },
          secondId
        ),
      400,
      "same account"
    );

    expect((await testBook.getTransaction(firstId))?.isTrashed()).to.equal(false);
    expect((await testBook.getTransaction(secondId))?.isTrashed()).to.equal(false);
  });
});
