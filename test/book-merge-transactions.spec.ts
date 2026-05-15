import { expect } from "chai";
import { Book } from "../src/model/Book.js";
import { Config } from "../src/model/Config.js";
import { Transaction } from "../src/model/Transaction.js";

describe("Book.mergeTransactions()", () => {
  let originalFetch: typeof globalThis.fetch;
  let requests: Array<{ url: string; init?: RequestInit }>;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    requests = [];
    globalThis.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      requests.push({ url, init });
      return new Response(JSON.stringify({ transaction: { id: "merged-1" } }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function createBook(): Book {
    const config: Config = {
      apiBaseUrl: "https://api.example.com",
      oauthTokenProvider: async () => "oauth-token",
    };
    return new Book({ id: "book-1" }, config);
  }

  function getRequestBody(index: number): bkper.TransactionList {
    const request = requests[index];
    const body = request.init?.body;
    expect(body).to.be.a("string");
    if (typeof body !== "string") {
      throw new Error("Expected request body to be a JSON string");
    }
    return JSON.parse(body) as bkper.TransactionList;
  }

  it("should accept wrapped transactions and string ids", async () => {
    const book = createBook();
    const transaction = new Transaction(book, {
      id: "tx-1",
      description: "Original transaction",
      createdAt: `${Date.now()}`,
    });

    const merged = await book.mergeTransactions(transaction, "tx-2");

    expect(merged.getId()).to.equal("merged-1");
    expect(requests).to.have.length(1);
    expect(requests[0].url).to.equal(
      "https://api.example.com/v5/books/book-1/transactions/merge?"
    );
    expect(requests[0].init?.method).to.equal("PATCH");
    expect(getRequestBody(0)).to.deep.equal({
      items: [{ id: "tx-1" }, { id: "tx-2" }],
    });
  });

  it("should accept plain transaction payloads", async () => {
    const book = createBook();
    const transactionPayload: bkper.Transaction = {
      id: "tx-1",
      description: "Plain payload transaction",
    };

    const merged = await book.mergeTransactions(transactionPayload, {
      id: "tx-2",
      description: "Second plain payload",
    });

    expect(merged.getId()).to.equal("merged-1");
    expect(getRequestBody(0)).to.deep.equal({
      items: [{ id: "tx-1" }, { id: "tx-2" }],
    });
  });

  it("should fail fast when a transaction id is missing", async () => {
    const book = createBook();
    let caughtError: unknown;

    try {
      await book.mergeTransactions({ description: "Missing id" }, "tx-2");
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).to.be.instanceOf(Error);
    if (!(caughtError instanceof Error)) {
      throw new Error("Expected mergeTransactions to throw an Error");
    }
    expect(caughtError.message).to.equal(
      "The first transaction must provide an id for merge."
    );
    expect(requests).to.have.length(0);
  });
});
