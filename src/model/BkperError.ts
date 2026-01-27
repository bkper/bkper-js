/**
 * Standard error class for Bkper API errors.
 * Extends Error to enable instanceof checks and standard error handling.
 *
 * @public
 */
export class BkperError extends Error {
    /** HTTP status code (e.g., 404, 400, 500) */
    readonly code: number;
    /** Machine-readable reason (e.g., "notFound", "badRequest") */
    readonly reason?: string;

    constructor(code: number, message: string, reason?: string) {
        super(message);
        this.name = 'BkperError';
        this.code = code;
        this.reason = reason;
    }
}
