import { Book } from "./Book";

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

}
