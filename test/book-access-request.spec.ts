import { expect } from "chai";
import { Bkper } from "../src/model/Bkper.js";
import { Book } from "../src/model/Book.js";
import { Collaborator } from "../src/model/Collaborator.js";
import { Config } from "../src/model/Config.js";
import { Permission } from "../src/model/Enums.js";

describe("Book access requests", () => {
  let originalFetch: typeof globalThis.fetch;
  let requests: Array<{ url: string; init?: RequestInit }>;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    requests = [];
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function createConfig(): Config {
    return {
      apiBaseUrl: "https://api.example.com",
      oauthTokenProvider: async () => "oauth-token",
    };
  }

  it("requests Book access with a trimmed message", async () => {
    globalThis.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      requests.push({ url: input.toString(), init });
      return new Response(null, { status: 204 });
    };
    const bkper = new Bkper(createConfig());

    const result = await bkper.requestBookAccess(
      "book-1",
      Permission.EDITOR,
      "  Please grant access  "
    );

    expect(result).to.equal(undefined);
    expect(requests).to.have.length(1);
    expect(requests[0].url).to.equal(
      "https://api.example.com/v5/books/book-1/collaborators/request?permission=EDITOR&message=Please%20grant%20access"
    );
    expect(requests[0].init?.method).to.equal("POST");
  });

  it("omits a whitespace-only message", async () => {
    globalThis.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      requests.push({ url: input.toString(), init });
      return new Response(null, { status: 204 });
    };
    const bkper = new Bkper(createConfig());

    await bkper.requestBookAccess("book-1", Permission.VIEWER, "   ");

    expect(requests).to.have.length(1);
    expect(requests[0].url).to.equal(
      "https://api.example.com/v5/books/book-1/collaborators/request?permission=VIEWER"
    );
  });

  it("resolves an access request as a Collaborator bound to the Book", async () => {
    globalThis.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      requests.push({ url: input.toString(), init });
      return new Response(
        JSON.stringify({
          email: "requester@example.com",
          avatarUrl: "https://example.com/avatar.png",
          permission: "POSTER",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    };
    const config = createConfig();
    const book = new Book({ id: "book-1" }, config);

    const collaborator = await book.resolveAccessRequest("request/id");

    expect(requests).to.have.length(1);
    expect(requests[0].url).to.equal(
      "https://api.example.com/v5/books/book-1/collaborators/request/request%2Fid?"
    );
    expect(requests[0].init?.method).to.equal("GET");
    expect(collaborator).to.be.instanceOf(Collaborator);
    expect(collaborator.getEmail()).to.equal("requester@example.com");
    expect(collaborator.getPermission()).to.equal(Permission.POSTER);
    expect(collaborator.getConfig()).to.equal(config);

    await collaborator.create();

    expect(requests).to.have.length(2);
    expect(requests[1].url).to.equal(
      "https://api.example.com/v5/books/book-1/collaborators?"
    );
    expect(requests[1].init?.method).to.equal("POST");
  });
});
