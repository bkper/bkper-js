import { expect } from "chai";
import { Book } from "../src/model/Book.js";
import { Config } from "../src/model/Config.js";

describe("Book.countTransactions()", () => {
  let originalFetch: typeof globalThis.fetch;
  let requestedUrl: string | undefined;
  let responseBody: string;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    requestedUrl = undefined;
    globalThis.fetch = async (input: RequestInfo | URL): Promise<Response> => {
      requestedUrl =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      return new Response(responseBody, {
        status: 200,
        headers: { "content-type": "application/json" },
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

  it("should return a number when the API serializes the int64 total as a string", async () => {
    responseBody = '{"total":"29"}';

    const count = await createBook().countTransactions("is:unchecked");

    expect(count).to.equal(29);
    expect(requestedUrl).to.equal(
      "https://api.example.com/v5/books/book-1/transactions/count?query=is%3Aunchecked"
    );
  });

  it("should return zero as a number", async () => {
    responseBody = '{"total":"0"}';

    expect(await createBook().countTransactions("account:Empty")).to.equal(0);
  });

  it("should return undefined when the API omits the total", async () => {
    responseBody = "{}";

    expect(await createBook().countTransactions()).to.equal(undefined);
  });
});
