import { Config } from "./Config.js";

/**
 * Abstract base class for all Bkper resources.
 * Provides common functionality for config management and JSON serialization.
 *
 * @public
 */
export abstract class Resource<T = any> {
    /**
     * The underlying payload data for this resource
     */
    public payload: T;

    /**
     * Constructs a new Resource
     * @param payload - The data payload for this resource
     */
    constructor(payload?: T) {
        this.payload = payload || ({} as T);
    }

    /**
     * Gets an immutable copy of the JSON payload for this resource.
     * @returns An immutable copy of the json payload
     */
    public json(): T {
        return { ...this.payload };
    }

    /** @internal */
    protected abstract getConfig(): Config;
}
