
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
  data: any
}

export class HttpApiRequest extends HttpRequest {

  public static config: Config = {}
  private retry = 0;

  constructor(path: string) {
    super(`${HttpApiRequest.config.apiBaseUrl || "https://app.bkper.com/_ah/api/bkper"}/${path}`);
  }

  async fetch(): Promise<HttpResponse> {
    this.addCustomHeaders();
    this.setHeader('Authorization', `Bearer ${await getAccessToken()}`);
    this.addParam('key', await getApiKey());
    // this.httpRequest.setMuteHttpExceptions(true);

    try {
      let resp = await super.execute();
      if (resp.status >= 200 && resp.status < 300) {
        console.log(resp.data)
        return resp;
      } else if (resp.status == 404) {
        return { data: null }
      } else if (this.retry <= 3) {
        this.retry++;
        if (HttpApiRequest.config.requestRetryHandler) {
          await HttpApiRequest.config.requestRetryHandler(resp.status, resp.data, this.retry);
        } else {
          console.log(`${resp.data} - Retrying... `)
        }
        return await this.fetch()
      } else {
        throw this.handleError(resp.data)
      }      
    } catch (err: any) {
      throw this.handleError(err.toJSON ? err.toJSON() : err)
    }
  }

  private handleError(err: any) {
      const customError = HttpApiRequest.config.requestErrorHandler ? HttpApiRequest.config.requestErrorHandler(err) : undefined;
      if (customError) {
        return customError
      } else {
        //Default error handler
        let error: HttpError = err.response?.data?.error
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
