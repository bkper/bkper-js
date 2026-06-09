import { expect } from "chai";
import { Book } from "../src/model/Book.js";
import { Config } from "../src/model/Config.js";

function headerValue(headers: HeadersInit | undefined, name: string): string | undefined {
  if (headers instanceof Headers) {
    return headers.get(name) ?? undefined;
  }
  if (Array.isArray(headers)) {
    return headers.find(([key]) => key === name)?.[1];
  }
  return headers?.[name];
}

describe("Book.listFiles()", () => {
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
      return new Response(
        JSON.stringify({
          items: [{ id: "file-1", name: "receipt.pdf" }],
          cursor: "next-cursor",
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

  it("requests files with default limit 100 and wraps the result", async () => {
    const book = createBook();

    const files = await book.listFiles();

    expect(requests).to.have.length(1);
    expect(requests[0].url).to.equal(
      "https://api.example.com/v5/books/book-1/files?limit=100"
    );
    expect(files.size()).to.equal(1);
    expect(files.getCursor()).to.equal("next-cursor");
    expect(files.getFirst()?.getName()).to.equal("receipt.pdf");
  });

  it("sends the cursor header for pagination", async () => {
    const book = createBook();

    await book.listFiles(25, "cursor-1");

    expect(requests).to.have.length(1);
    expect(requests[0].url).to.equal(
      "https://api.example.com/v5/books/book-1/files?limit=25"
    );
    expect(headerValue(requests[0].init?.headers, "cursor")).to.equal("cursor-1");
  });
});
