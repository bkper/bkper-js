import { Book } from "./Book.js";
import { Config } from "./Config.js";
import * as QueryService from "../service/query-service.js";
import { Resource } from "./Resource.js";

/**
 * Defines a saved Query in a [[Book]].
 *
 * Queries can be saved on Books by users.
 *
 * @public
 */
export class Query extends Resource<bkper.Query> {
    /** @internal */
    private book: Book;

    constructor(book: Book, payload?: bkper.Query) {
        super(payload);
        this.book = book;
    }

    /** @internal */
    public getConfig(): Config {
        return this.book.getConfig();
    }

    /**
     * Gets the Query universal identifier.
     *
     * @returns The Query universal identifier
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the title of this saved Query.
     *
     * @returns The title of this saved Query
     */
    public getTitle(): string | undefined {
        return this.payload.title;
    }

    /**
     * Sets the title of this saved Query.
     *
     * @param title - The title of this saved Query
     *
     * @returns This Query, for chaining
     */
    public setTitle(title: string): Query {
        this.payload.title = title;
        return this;
    }

    /**
     * Gets the query string to be executed.
     *
     * @returns This Query string to be executed
     */
    public getQuery(): string | undefined {
        return this.payload.query;
    }

    /**
     * Sets the query string associated with this saved Query.
     *
     * @param query - The query string to be executed
     *
     * @returns This Query, for chaining
     */
    public setQuery(query: string): Query {
        this.payload.query = query;
        return this;
    }

    /**
     * Perform create new Query.
     *
     * @returns This Query, for chaining
     */
    public async create(): Promise<Query> {
        this.payload = await QueryService.createSavedQuery(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.updateQueryCache();
        return this;
    }

    /**
     * Perform update Query, applying pending changes.
     *
     * @returns This Query, for chaining
     */
    public async update(): Promise<Query> {
        this.payload = await QueryService.updateSavedQuery(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.updateQueryCache();
        return this;
    }

    /**
     * Perform delete Query.
     *
     * @returns This Query, for chaining
     */
    public async remove(): Promise<Query> {
        const queryId = this.getId();
        if (!queryId) {
            throw new Error("Query id null!");
        }
        this.payload = await QueryService.deleteSavedQuery(
            this.book.getId(),
            queryId,
            this.getConfig()
        );
        this.updateQueryCache(true);
        return this;
    }

    /** @internal */
    private updateQueryCache(deleted?: boolean): void {
        if (this.book.queries) {
            this.book.queries = this.book.queries.filter(
                (q) => q.getId() !== this.getId()!
            );
            if (!deleted) {
                this.book.queries.push(this);
            }
        }
    }
}
