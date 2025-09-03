export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
  status: number;
  data: any;
  headers?: any;
}

export class HttpRequest {

  private params: Array<{ name: string, value: string }> = [];
  private url: string;
  private headers: { [key: string]: string } = {};
  private method: HttpMethod = 'GET';
  private payload: any = null;

  public static API_KEY: string;

  constructor(url: string) {
    this.url = url;
  }

  public setMethod(method: HttpMethod) {
    this.method = method;
    return this;
  }

  public setHeader(name: string, value: string) {
    this.headers[name] = value;
    return this;
  }

  public addParam(name: string, value: any) {
    this.params.push({ name, value });
    return this;
  }

  public setPayload(payload: any) {
    this.payload = payload;
    return this;
  }

  /**
   * Gets the result url, with query params appended.
   */
  private getUrl(): string {
    let url = this.url;
    if (this.params != null) {
      let i = 0;
      if (url.indexOf('?') < 0) {
        url += '?';
      } else {
        i++;
      }
      for (const param of this.params) {
        if (i > 0) {
          url += "&";
        }
        var key = param.name;
        var value = param.value;
        if (value != null) {
          url += key + "=" + encodeURIComponent(value);
          i++;
        }
      }
    }
    return url;
  }

  async execute(): Promise<HttpResponse> {

    const url = this.getUrl();

    const fetchOptions: RequestInit = {
      method: this.method,
      headers: this.headers,
    };

    // Add body for non-GET requests
    if (this.payload && this.method !== 'GET') {
      if (typeof this.payload === 'string') {
        fetchOptions.body = this.payload;
      } else {
        fetchOptions.body = JSON.stringify(this.payload);
        // Ensure content-type is set for JSON payloads
        if (!this.headers['Content-Type'] && !this.headers['content-type']) {
          fetchOptions.headers = {
            ...this.headers,
            'Content-Type': 'application/json'
          };
        }
      }
    }

    const response = await fetch(url, fetchOptions);

    // Parse response body
    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Return axios-compatible response structure
    return {
      data: data,
      status: response.status,
      headers: response.headers
    };

  }

}
