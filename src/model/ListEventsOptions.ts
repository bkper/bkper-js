/**
 * Options for listing events in a Book.
 *
 * @public
 */
export interface ListEventsOptions {
    /**
     * The start date (inclusive) for the events search range, in [RFC3339](https://en.wikipedia.org/wiki/ISO_8601#RFC_3339) format.
     */
    afterDate?: string;

    /**
     * The end date (exclusive) for the events search range, in [RFC3339](https://en.wikipedia.org/wiki/ISO_8601#RFC_3339) format.
     */
    beforeDate?: string;

    /**
     * The ID of the event's resource (Transaction, Account, or Group).
     *
     * When set, `onError` is ignored.
     */
    resourceId?: string;

    /**
     * Whether to filter events by error responses.
     *
     * `true` returns events with at least one error response.
     * `false` returns events with no error responses.
     * `null` or `undefined` includes events regardless of error responses.
     *
     * Ignored when `resourceId` is set.
     */
    onError?: boolean;

    /**
     * The maximum number of events to return.
     *
     * Defaults to `50`, maximum is `200`.
     */
    limit: number;

    /**
     * The cursor for pagination.
     */
    cursor?: string;
}
