import { expect } from "chai";
import { Book } from "../src/model/Book.js";
import { Config } from "../src/model/Config.js";

describe("Book.getTransactionsByIds()", () => {
  let originalFetch: typeof globalThis.fetch;
  let requests: Array<{ url: string; init?: RequestInit }>;
  let activeRequests: number;
  let maxActiveRequests: number;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    requests = [];
    activeRequests = 0;
    maxActiveRequests = 0;
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
      activeRequests++;
      maxActiveRequests = Math.max(maxActiveRequests, activeRequests);
      await new Promise(resolve => setTimeout(resolve, 1));
      activeRequests--;

      const body = init?.body;
      if (typeof body !== "string") {
        throw new Error("Expected a JSON request body");
      }
      const transactionList = JSON.parse(body) as bkper.TransactionList;
      return new Response(
        JSON.stringify({
          items: (transactionList.items || []).map(transaction => ({
            id: transaction.id,
            description: `Transaction ${transaction.id}`,
          })),
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
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

  function getRequestIds(index: number): Array<string | undefined> {
    const body = requests[index].init?.body;
    if (typeof body !== "string") {
      throw new Error("Expected a JSON request body");
    }
    const transactionList = JSON.parse(body) as bkper.TransactionList;
    return (transactionList.items || []).map(transaction => transaction.id);
  }

  it("should split more than 200 ids into sequential requests and preserve order", async () => {
    const ids = Array.from({ length: 201 }, (_, index) => `tx-${index}`);

    const transactions = await createBook().getTransactionsByIds(ids);

    expect(requests).to.have.length(2);
    expect(maxActiveRequests).to.equal(1);
    expect(requests[0].url).to.equal(
      "https://api.example.com/v5/books/book-1/transactions/load/batch?"
    );
    expect(requests[0].init?.method).to.equal("POST");
    expect(getRequestIds(0)).to.deep.equal(ids.slice(0, 200));
    expect(getRequestIds(1)).to.deep.equal(ids.slice(200));
    expect(transactions.map(transaction => transaction.getId())).to.deep.equal(ids);
  });

  it("should return empty without a request", async () => {
    expect(await createBook().getTransactionsByIds([])).to.deep.equal([]);
    expect(requests).to.deep.equal([]);
  });

  it("should reject blank and duplicate ids before any request", async () => {
    try {
      await createBook().getTransactionsByIds(["tx-1", "   "]);
      expect.fail("Expected blank id validation to fail");
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      if (!(error instanceof Error)) {
        throw error;
      }
      expect(error.message).to.equal("Transaction IDs must be non-blank strings.");
    }

    try {
      await createBook().getTransactionsByIds([" tx-1", "tx-1"]);
      expect.fail("Expected duplicate id validation to fail");
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      if (!(error instanceof Error)) {
        throw error;
      }
      expect(error.message).to.equal("Duplicate transaction ID: tx-1");
    }
    expect(requests).to.deep.equal([]);
  });
});
