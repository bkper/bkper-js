import { Config } from "../model/Config.js";
import { BkperError } from "../model/BkperError.js";
import { HttpRequest } from "./http-request.js";

/**
 * The official Bkper API base URL.
 */
export const API_BASE_URL = "https://api.bkper.app";

/**
 * Resolves the base URL based on config.
 */
export function resolveBaseUrl(config: Config): string {
    if (config.apiBaseUrl) {
        return config.apiBaseUrl;
    }
    return API_BASE_URL;
}

export interface HttpError {
    errors: {
        domain: string;
        reason: string;
        message: string;
    }[];
    code: number;
    message: string;
}

export interface HttpResponse {
    data: any;
    status?: number;
}

interface NetworkError extends TypeError {
    response?: {
        status?: number;
        code?: number;
    };
    status?: number;
    code?: number;
    cause?: {
        code?: string;
        hostname?: string;
        address?: string;
        port?: number | string;
        syscall?: string;
    };
}

export class HttpApiRequest extends HttpRequest {
    private retry = 0;
    private config: Config;
    private requestPath: string;

    constructor(path: string, config: Config) {
        const baseUrl = resolveBaseUrl(config);
        super(`${baseUrl}/${path}`);
        this.config = config;
        this.requestPath = path;
    }

    async fetch(): Promise<HttpResponse> {
        this.addCustomHeaders();
        await this.addAgentIdHeader();
        this.setHeader("Authorization", `Bearer ${await this.getAccessToken()}`);
        await this.addApiKeyHeader();

        try {
            let resp = await super.execute();
            if (resp.status >= 200 && resp.status < 300) {
                return resp;
            } else if (resp.status == 404) {
                const errorObj = {
                    response: {
                        status: resp.status,
                        data: resp.data,
                    },
                };
                throw this.handleError(errorObj);
            } else if (this.shouldRetry(resp.status) && this.retry < 3) {
                this.retry++;
                const effectiveConfig = this.config;
                if (effectiveConfig.requestRetryHandler) {
                    await effectiveConfig.requestRetryHandler(resp.status, resp.data, this.retry);
                } else {
                    console.log(`${JSON.stringify(resp.data)} - Retrying ${this.retry}/3... `);
                }
                return await this.fetch();
            } else {
                // Create an error object that matches axios error structure for compatibility
                const errorObj = {
                    response: {
                        status: resp.status,
                        data: resp.data,
                    },
                };
                throw this.handleError(errorObj);
            }
        } catch (error: any) {
            if (error instanceof BkperError) {
                throw error;
            }
            // If error already has response structure (from upstream), preserve it
            if (error.response) {
                throw error;
            }
            // Network error or fetch failure
            if (this.isNetworkError(error)) {
                // Network error - retry if within retry limit
                if (this.retry < 3) {
                    this.retry++;
                    const effectiveConfig = this.config;
                    if (effectiveConfig.requestRetryHandler) {
                        await effectiveConfig.requestRetryHandler(520, error, this.retry);
                    } else {
                        console.log(`${this.formatNetworkErrorMessage(error)} - Retrying ${this.retry}/3... `);
                    }
                    return await this.fetch();
                }
            }

            throw this.handleError(error);
        }
    }

    private shouldRetry(status?: number): boolean {
        return status == 408 || status == 429 || (status != null && status >= 500);
    }

    private isNetworkError(error: unknown): error is NetworkError {
        return error instanceof TypeError && error.message.toLowerCase().includes("fetch");
    }

    private formatNetworkErrorMessage(error: NetworkError): string {
        const details: string[] = [];
        if (error.cause?.code) {
            details.push(error.cause.code);
        }
        if (error.cause?.hostname) {
            details.push(error.cause.hostname);
        } else if (error.cause?.address) {
            details.push(error.cause.address);
        }
        if (error.cause?.port !== undefined) {
            details.push(`port=${error.cause.port}`);
        }
        if (error.cause?.syscall) {
            details.push(`syscall=${error.cause.syscall}`);
        }

        if (details.length > 0) {
            return `Network error calling ${this.requestPath}: ${error.message} (${details.join(", ")})`;
        }
        return `Network error calling ${this.requestPath}: ${error.message}`;
    }

    private handleError(err: any): BkperError {
        const effectiveConfig = this.config;
        const customError = effectiveConfig.requestErrorHandler
            ? effectiveConfig.requestErrorHandler(err)
            : undefined;
        if (customError) {
            return customError;
        } else if (err instanceof BkperError) {
            return err;
        } else if (this.isNetworkError(err)) {
            return new BkperError(
                err.response?.status || err.response?.code || err.status || err.code || 0,
                this.formatNetworkErrorMessage(err),
                undefined
            );
        } else {
            // Read internal HttpError from response
            let error: HttpError = err.response?.data?.error || err.data?.error || err.error;
            if (error) {
                // Transform to BkperError
                return new BkperError(error.code, error.message, error.errors?.[0]?.reason);
            } else {
                // Fallback for network errors, etc.
                return new BkperError(
                    err.response?.status || err.response?.code || err.status || err.code || 0,
                    err.message || String(err),
                    undefined
                );
            }
        }
    }

    private async addCustomHeaders() {
        const effectiveConfig = this.config;
        if (effectiveConfig.requestHeadersProvider) {
            const headers = await effectiveConfig.requestHeadersProvider();
            Object.entries(headers).forEach(([key, value]) => this.setHeader(key, value));
        }
    }

    private async addAgentIdHeader() {
        const effectiveConfig = this.config;
        if (effectiveConfig.agentIdProvider) {
            const agentId = await effectiveConfig.agentIdProvider();
            if (agentId) {
                this.setHeader("bkper-agent-id", agentId);
            }
        }
    }

    private async addApiKeyHeader() {
        const effectiveConfig = this.config;
        if (effectiveConfig.apiKeyProvider) {
            const apiKey = await effectiveConfig.apiKeyProvider();
            if (apiKey) {
                this.setHeader("bkper-api-key", apiKey);
            }
        }
    }

    private async getAccessToken(): Promise<string | undefined> {
        let token: string | undefined = undefined;
        const effectiveConfig = this.config;
        if (effectiveConfig.oauthTokenProvider) {
            token = await effectiveConfig.oauthTokenProvider();
        } else {
            console.warn(`Token provider NOT configured!`);
        }

        if (token) {
            token = token.replace("Bearer ", "");
            token = token.replace("bearer ", "");
        }

        return token;
    }
}

export class HttpBooksApiV5Request extends HttpApiRequest {
    constructor(service: string, config: Config) {
        super(`v5/books/${service}`, config);
    }
}

export class HttpApiV5Request extends HttpApiRequest {
    constructor(service: string, config: Config) {
        super(`v5/${service}`, config);
    }
}
