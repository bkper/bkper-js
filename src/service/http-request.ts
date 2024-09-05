import https from 'https';
import axios, { AxiosResponse } from 'axios';

export type HttpMethod = "GET"|"POST"|"PUT"|"PATCH"|"DELETE";
const httpsAgent = https && https.Agent ? new https.Agent({ keepAlive: true }) : undefined;

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

export class HttpRequest  {

  private params: Array<{name: string, value: string}> = [];
  private url: string;
  private headers: {[key: string]: string} = {};
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
    this.params.push({name, value});
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
      let i = 0
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
    return url
  }
  async execute(): Promise<AxiosResponse<any, any>> {
    const url = this.getUrl();
    return axios.request({
      url: url,
      method: this.method,
      headers: this.headers,
      data: this.payload,
      httpsAgent: url.startsWith('https') ?  httpsAgent : undefined,
      // withCredentials: true
    })
  }
}


