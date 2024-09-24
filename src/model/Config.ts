
/**
 * This class defines the [[Bkper]] API Config.
 * 
 * @public
 */
export interface Config {

  /**
   * The API key to identify the agent.
   * 
   * API keys are intended for agent identification only, not for authentication. [Learn more](https://cloud.google.com/endpoints/docs/frameworks/java/when-why-api-key)
   * 
   * See how to create your api key [here](https://cloud.google.com/docs/authentication/api-keys).
   */
  apiKeyProvider?: () => Promise<string>;

  /**
   * Issue a valid OAuth2 access token with **https://www.googleapis.com/auth/userinfo.email** scope authorized.
   */
  oauthTokenProvider?: () => Promise<string | undefined>;

  /**
   * Provides additional headers to append to the API request
   */
  requestHeadersProvider?: () => Promise<{ [key: string]: string }>;

  /**
   * Custom request error handler
   */
  requestErrorHandler?: (error: any) => any;
  
  /**
   * Custom request retry handler.
   *
   * This function is called when a request fails and needs to be retried.
   * It provides the HTTP status code, error message, and the number of retry attempts made so far.
   *
   * @param code - The HTTP status code of the failed request.
   * @param message - The error message associated with the failed request.
   * @param attempt - The number of retry attempts made so far.
   */
  requestRetryHandler?: (status?: number, message?: string, attempt?: number ) => Promise<void>;

  /**
   * Sets the base api url. Default to https://app.bkper.com/_ah/api/bkper
   */
  apiBaseUrl?: string

}
