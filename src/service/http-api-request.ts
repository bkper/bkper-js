import { Config } from '../model/Config.js';
import { HttpRequest } from './http-request.js';

export interface HttpError {
  errors:
  {
    domain: string,
    reason: string,
    message: string
  }[]
  code: number,
  message: string
}

export interface HttpResponse {
  data: any,
  status?: number
}

export class HttpApiRequest extends HttpRequest {

  public static config: Config = {};
  private retry = 0;

  constructor(path: string) {
    super(`${HttpApiRequest.config.apiBaseUrl || "https://app.bkper.com/_ah/api/bkper"}/${path}`);
  }

  async fetch(): Promise<HttpResponse> {

    this.addCustomHeaders();
    this.setHeader('Authorization', `Bearer ${await getAccessToken()}`);
    this.addParam('key', await getApiKey());

    try {
      let resp = await super.execute();
      if (resp.status >= 200 && resp.status < 300) {
        return resp;
      } else if (resp.status == 404) {
        return { data: null, status: resp.status };
      } else if (resp.status != 400 && this.retry <= 3) {
        this.retry++;
        if (HttpApiRequest.config.requestRetryHandler) {
          await HttpApiRequest.config.requestRetryHandler(resp.status, resp.data, this.retry);
        } else {
          console.log(`${JSON.stringify(resp.data)} - Retrying... `);
        }
        return await this.fetch();
      } else {
        // Create an error object that matches axios error structure for compatibility
        const errorObj = {
          response: {
            status: resp.status,
            data: resp.data
          }
        };
        throw this.handleError(errorObj);
      }
    } catch (error: any) {
      // If error already has response structure (from our code above), use it
      if (error.response) {
        throw error;
      }
      // Network error or fetch failure
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - retry if within retry limit
        if (this.retry <= 3) {
          this.retry++;
          if (HttpApiRequest.config.requestRetryHandler) {
            await HttpApiRequest.config.requestRetryHandler(520, undefined, this.retry);
          } else {
            console.log(`Network error - Retrying... `);
          }
          return await this.fetch();
        }
      }

      // Other errors
      console.log('Error', error.message);
      throw this.handleError(error);
    }
  }

  private handleError(err: any) {
    const customError = HttpApiRequest.config.requestErrorHandler ? HttpApiRequest.config.requestErrorHandler(err) : undefined;
    if (customError) {
      return customError;
    } else {
      //Default error handler
      let error: HttpError = err.response?.data?.error || err.data?.error || err.error;
      if (error) {
        return error.message;
      } else {
        return err.message || err;
      }
    }
  }

  private async addCustomHeaders() {
    if (HttpApiRequest.config.requestHeadersProvider) {
      const headers = await HttpApiRequest.config.requestHeadersProvider();
      Object.entries(headers).forEach(([key, value]) => this.setHeader(key, value));
    }
  }
}


async function getApiKey() {
  if (HttpApiRequest.config.apiKeyProvider) {
    return await HttpApiRequest.config.apiKeyProvider()
  }
  return null;
}

async function getAccessToken(): Promise<string | undefined> {
  let token: string | undefined = undefined;
  if (HttpApiRequest.config.oauthTokenProvider) {
    token = await HttpApiRequest.config.oauthTokenProvider();
  } else {
    console.warn(`Token provider NOT configured!`);
  }

  if (token) {
    token = token.replace('Bearer ', '')
    token = token.replace('bearer ', '')
  }

  return token;
}

export class HttpBooksApiV5Request extends HttpApiRequest {
  constructor(service: string) {
    super(`v5/books/${service}`)
  }
}

export class HttpApiV5Request extends HttpApiRequest {
  constructor(service: string) {
    super(`v5/${service}`)
  }
}
