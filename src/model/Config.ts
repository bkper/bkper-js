/**
 * This class defines the [[Bkper]] API Config.
 * 
 * @public
 */
export interface Config {

    /**
     * Optional API key for dedicated quota limits.
     * 
     * If not provided, requests use a shared managed quota via the Bkper API proxy.
     * Use your own API key for dedicated quota limits and project-level usage tracking.
     * 
     * API keys are for project identification only, not for authentication or agent attribution.
     * Agent attribution is handled separately via the `agentIdProvider`.
     */
    apiKeyProvider?: () => Promise<string>;

    /**
     * Issue a valid OAuth2 access token with **https://www.googleapis.com/auth/userinfo.email** scope authorized.
     */
    oauthTokenProvider?: () => Promise<string | undefined>;

    /**
     * Provides the agent ID to identify the calling agent for attribution purposes.
     * 
     * This ID is sent via the `bkper-agent-id` header with each API request,
     * allowing the server to attribute actions to the correct agent.
     */
    agentIdProvider?: () => Promise<string | undefined>;

    /**
     * Provides additional headers to append to the API request
     */
    requestHeadersProvider?: () => Promise<{ [key: string]: string }>;

    /**
     * Custom request error handler
     * 
     * @param error - The error object of the failed request.
     */
    requestErrorHandler?: (error: any) => any;

    /**
     * Custom request retry handler.
     *
     * This function is called when a request fails and needs to be retried.
     * It provides the HTTP status code, error message, and the number of retry attempts made so far.
     *
     * @param code - The HTTP status code of the failed request.
     * @param error - The error object of the failed request.
     * @param attempt - The number of retry attempts made so far.
     */
    requestRetryHandler?: (status?: number, error?: any, attempt?: number) => Promise<void>;

    /**
     * Sets the base api url. Default to https://api.bkper.app
     * 
     * @internal
     */
    apiBaseUrl?: string

}
