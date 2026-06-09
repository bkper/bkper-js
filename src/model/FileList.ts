import { Book } from './Book.js';
import { File } from './File.js';

/**
 * A list associated with a file query.
 *
 * @public
 */
export class FileList {

    private payload: bkper.FileList;

    /** @internal */
    private book: Book;

    constructor(book: Book, payload: bkper.FileList) {
        this.book = book;
        this.payload = payload || {};
    }

    /**
     * Gets the cursor associated with the query for pagination.
     *
     * @returns The cursor associated with the query for pagination
     */
    public getCursor(): string | undefined {
        return this.payload.cursor;
    }

    /**
     * Gets the first File in the list.
     *
     * @returns The first File in the list
     */
    public getFirst(): File | undefined {
        const files = this.getItems();
        return files.length > 0 ? files[0] : undefined;
    }

    /**
     * Gets the total number of files in the list.
     *
     * @returns The total number of files
     */
    public size(): number {
        return this.payload.items?.length || 0;
    }

    /**
     * Gets the files in the list.
     *
     * @returns An array of File objects
     */
    public getItems(): File[] {
        const files: File[] = [];
        for (const file of this.payload.items ?? []) {
            files.push(new File(this.book, file));
        }
        return files;
    }

}
