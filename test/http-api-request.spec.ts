import { expect } from "chai";
import {
  API_BASE_URL,
  HttpApiRequest,
  resolveBaseUrl,
} from "../src/service/http-api-request.js";
import { BkperError } from "../src/model/BkperError.js";
import { Config } from "../src/model/Config.js";

describe("http-api-request", () => {
  describe("#resolveBaseUrl()", () => {
    it("should use custom apiBaseUrl when provided", () => {
      const config: Config = {
        apiBaseUrl: "https://custom.example.com/api",
        apiKeyProvider: async () => "my-api-key",
      };
      expect(resolveBaseUrl(config)).to.equal("https://custom.example.com/api");
    });

    it("should use custom apiBaseUrl even without apiKeyProvider", () => {
      const config: Config = {
        apiBaseUrl: "https://localhost:8081/_ah/api/bkper",
      };
      expect(resolveBaseUrl(config)).to.equal(
        "https://localhost:8081/_ah/api/bkper"
      );
    });

    it("should use API_BASE_URL when apiKeyProvider is set without custom apiBaseUrl", () => {
      const config: Config = {
        apiKeyProvider: async () => "my-api-key",
      };
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

    it("should use API_BASE_URL when no apiKeyProvider and no apiBaseUrl", () => {
      const config: Config = {};
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

    it("should use API_BASE_URL when apiKeyProvider is undefined", () => {
      const config: Config = {
        apiKeyProvider: undefined,
      };
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

    it("should use API_BASE_URL with oauthTokenProvider when no custom apiBaseUrl", () => {
      const config: Config = {
        apiKeyProvider: async () => "my-api-key",
        oauthTokenProvider: async () => "oauth-token",
      };
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

    it("should use API_BASE_URL with oauthTokenProvider only when no apiKeyProvider", () => {
      const config: Config = {
        oauthTokenProvider: async () => "oauth-token",
      };
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });
  });

  describe("BkperError", () => {
    it("should have code, message, and optional reason properties", () => {
      const error = new BkperError(
        404,
        "App NOT found! ID: invalid-id",
        "notFound"
      );
      expect(error.code).to.equal(404);
      expect(error.message).to.equal("App NOT found! ID: invalid-id");
      expect(error.reason).to.equal("notFound");
    });

    it("should allow reason to be undefined", () => {
      const error = new BkperError(500, "Internal server error");
      expect(error.code).to.equal(500);
      expect(error.message).to.equal("Internal server error");
      expect(error.reason).to.be.undefined;
    });

    it("should extend Error", () => {
      const error = new BkperError(400, "Bad request", "badRequest");
      expect(error).to.be.instanceOf(Error);
      expect(error).to.be.instanceOf(BkperError);
      expect(error.name).to.equal("BkperError");
    });
  });

  describe("HttpApiRequest#fetch()", () => {
    const collaboratorMessage =
      "The user [mael@bkper.com] is not a collaborator on the book [Contas - book-id]";

    let originalFetch: typeof globalThis.fetch;
    let originalLog: typeof console.log;
    let originalWarn: typeof console.warn;
    let logs: string[];
    let warnings: string[];

    beforeEach(() => {
      originalFetch = globalThis.fetch;
      originalLog = console.log;
      originalWarn = console.warn;
      logs = [];
      warnings = [];
      console.log = (...args: unknown[]) => {
        logs.push(args.map(value => String(value)).join(" "));
      };
      console.warn = (...args: unknown[]) => {
        warnings.push(args.map(value => String(value)).join(" "));
      };
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
      console.log = originalLog;
      console.warn = originalWarn;
    });

    function createConfig(overrides: Partial<Config> = {}): Config {
      return {
        oauthTokenProvider: async () => "oauth-token",
        ...overrides,
      };
    }

    function createJsonResponse(status: number, body: unknown): Response {
      return new Response(JSON.stringify(body), {
        status,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    it("should fail fast on 401 access errors without retry noise", async () => {
      let fetchCalls = 0;
      globalThis.fetch = async () => {
        fetchCalls++;
        return createJsonResponse(401, {
          error: {
            errors: [
              {
                domain: "global",
                reason: "required",
                message: collaboratorMessage,
              },
            ],
            code: 401,
            message: collaboratorMessage,
          },
        });
      };

      const retryAttempts: number[] = [];
      const request = new HttpApiRequest(
        "v5/books/transactions",
        createConfig({
          requestRetryHandler: async (_status, _error, attempt) => {
            if (attempt !== undefined) {
              retryAttempts.push(attempt);
            }
          },
        })
      );

      try {
        await request.fetch();
        expect.fail("Expected fetch to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(BkperError);
        if (!(error instanceof BkperError)) {
          throw error;
        }
        expect(error.code).to.equal(401);
        expect(error.reason).to.equal("required");
        expect(error.message).to.equal(collaboratorMessage);
      }

      expect(fetchCalls).to.equal(1);
      expect(retryAttempts).to.deep.equal([]);
      expect(logs).to.deep.equal([]);
      expect(warnings).to.deep.equal([]);
    });

    it("should fail fast on 400 errors without retry", async () => {
      let fetchCalls = 0;
      globalThis.fetch = async () => {
        fetchCalls++;
        return createJsonResponse(400, {
          error: {
            code: 400,
            message: "Bad request",
          },
        });
      };

      const retryAttempts: number[] = [];
      const request = new HttpApiRequest(
        "v5/books/transactions",
        createConfig({
          requestRetryHandler: async (_status, _error, attempt) => {
            if (attempt !== undefined) {
              retryAttempts.push(attempt);
            }
          },
        })
      );

      try {
        await request.fetch();
        expect.fail("Expected fetch to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(BkperError);
        if (!(error instanceof BkperError)) {
          throw error;
        }
        expect(error.code).to.equal(400);
        expect(error.message).to.equal("Bad request");
      }

      expect(fetchCalls).to.equal(1);
      expect(retryAttempts).to.deep.equal([]);
      expect(logs).to.deep.equal([]);
    });

    it("should retry transient 503 errors and succeed", async () => {
      let fetchCalls = 0;
      globalThis.fetch = async () => {
        fetchCalls++;
        if (fetchCalls === 1) {
          return createJsonResponse(503, {
            error: {
              code: 503,
              message: "Backend unavailable",
            },
          });
        }
        return createJsonResponse(200, { ok: true });
      };

      const retries: Array<{ status?: number; error?: unknown; attempt?: number }> = [];
      const request = new HttpApiRequest(
        "v5/books/transactions",
        createConfig({
          requestRetryHandler: async (status, error, attempt) => {
            retries.push({ status, error, attempt });
          },
        })
      );

      const response = await request.fetch();

      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({ ok: true });
      expect(fetchCalls).to.equal(2);
      expect(retries).to.have.length(1);
      expect(retries[0].status).to.equal(503);
      expect(retries[0].attempt).to.equal(1);
      expect(retries[0].error).to.deep.equal({
        error: {
          code: 503,
          message: "Backend unavailable",
        },
      });
    });

    it("should log useful details for network retries and preserve the original error", async () => {
      let fetchCalls = 0;
      const networkError: TypeError & {
        cause?: {
          code?: string;
          hostname?: string;
          syscall?: string;
        };
      } = new TypeError("fetch failed");
      networkError.cause = {
        code: "ENOTFOUND",
        hostname: "api.bkper.app",
        syscall: "getaddrinfo",
      };

      globalThis.fetch = async () => {
        fetchCalls++;
        if (fetchCalls === 1) {
          throw networkError;
        }
        return createJsonResponse(200, { ok: true });
      };

      const retries: Array<{ status?: number; error?: unknown; attempt?: number }> = [];
      const request = new HttpApiRequest(
        "v5/books/transactions",
        createConfig({
          requestRetryHandler: async (status, error, attempt) => {
            retries.push({ status, error, attempt });
          },
        })
      );

      const response = await request.fetch();

      expect(response.status).to.equal(200);
      expect(fetchCalls).to.equal(2);
      expect(retries).to.have.length(1);
      expect(retries[0].status).to.equal(520);
      expect(retries[0].attempt).to.equal(1);
      expect(retries[0].error).to.equal(networkError);

      globalThis.fetch = async () => {
        throw networkError;
      };

      const requestWithoutHandler = new HttpApiRequest(
        "v5/books/transactions",
        createConfig()
      );

      try {
        await requestWithoutHandler.fetch();
        expect.fail("Expected fetch to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(BkperError);
        if (!(error instanceof BkperError)) {
          throw error;
        }
        expect(error.message).to.contain("Network error calling v5/books/transactions");
        expect(error.message).to.contain("ENOTFOUND");
        expect(error.message).to.contain("api.bkper.app");
      }

      expect(logs[0]).to.contain("Network error calling v5/books/transactions");
      expect(logs[0]).to.contain("ENOTFOUND");
      expect(logs[0]).to.contain("Retrying 1/3");
    });

    it("should stop after exactly 3 retries for repeated transient errors", async () => {
      let fetchCalls = 0;
      globalThis.fetch = async () => {
        fetchCalls++;
        return createJsonResponse(503, {
          error: {
            code: 503,
            message: "Backend unavailable",
          },
        });
      };

      const request = new HttpApiRequest(
        "v5/books/transactions",
        createConfig()
      );

      try {
        await request.fetch();
        expect.fail("Expected fetch to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(BkperError);
        if (!(error instanceof BkperError)) {
          throw error;
        }
        expect(error.code).to.equal(503);
        expect(error.message).to.equal("Backend unavailable");
      }

      expect(fetchCalls).to.equal(4);
      expect(logs).to.have.length(3);
      expect(logs[0]).to.contain("Retrying 1/3");
      expect(logs[1]).to.contain("Retrying 2/3");
      expect(logs[2]).to.contain("Retrying 3/3");
    });
  });
});
