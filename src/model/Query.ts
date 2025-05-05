import { Book } from "./Book";
import * as QueryService from '../service/query-service.js';

/**
 * Defines a saved Query in a [[Book]].
 * 
 * Queries can be saved on Books by users.
 * 
 * @public
 */
export class Query {

    public payload: bkper.Query;

    /** @internal */
    private book: Book;

    constructor(book: Book, payload?: bkper.Query) {
        this.book = book;
        this.payload = payload || {};
    }

    /**
     * @returns The wrapped plain json object
     */
    public json(): bkper.Query {
        return { ...this.payload };
    }

    /**
     * @returns The Query universal identifier
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * @return The title of this saved Query
     */
    public getTitle(): string | undefined {
        return this.payload.title;
    }

    /**
     * @return This Query string to be executed
     */
    public getQuery(): string | undefined {
        return this.payload.query;
    }

    /**
     * Perform create new Query.
     */
    public async create(): Promise<Query> {
        this.payload = await QueryService.createSavedQuery(this.book.getId(), this.payload);
        this.updateQueryCache();
        return this;
    }

    /**
     * Perform update Query, applying pending changes.
     */
    public async update(): Promise<Query> {
        this.payload = await QueryService.updateSavedQuery(this.book.getId(), this.payload);
        this.updateQueryCache();
        return this;
    }

    /**
     * Perform delete Query.
     */
    public async remove(): Promise<Query> {
        const queryId = this.getId();
        if (!queryId) {
            throw new Error("Query id null!");
        }
        this.payload = await QueryService.deleteSavedQuery(this.book.getId(), queryId);
        this.updateQueryCache(true);
        return this;
    }

    /** @internal */
    private updateQueryCache(deleted?: boolean): void {
        if (this.book.queries) {
            this.book.queries = this.book.queries.filter(q => q.getId() !== this.getId()!);
            if (!deleted) {
                this.book.queries.push(this);
            }
        }
    }

}
