import { expect } from "chai";
import { Book } from "../src/model/Book.js";
import { Config } from "../src/model/Config.js";

describe("Book.listEvents()", () => {
  let originalFetch: typeof globalThis.fetch;
  let requestedUrls: string[];

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    requestedUrls = [];
    globalThis.fetch = async (
      input: RequestInfo | URL
    ): Promise<Response> => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      requestedUrls.push(url);
      return new Response(JSON.stringify({ items: [] }), {
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

  it("omits the error query param when onError is null", async () => {
    const book = createBook();
    await book.listEvents(null, null, null, null, 10);
    expect(requestedUrls).to.have.length(1);
    expect(requestedUrls[0]).to.not.contain("error=");
  });

  it("sends error=false when onError is false", async () => {
    const book = createBook();
    await book.listEvents(null, null, false, null, 10);
    expect(requestedUrls).to.have.length(1);
    expect(requestedUrls[0]).to.contain("error=false");
  });

  it("sends error=true when onError is true", async () => {
    const book = createBook();
    await book.listEvents(null, null, true, null, 10);
    expect(requestedUrls).to.have.length(1);
    expect(requestedUrls[0]).to.contain("error=true");
  });
});
