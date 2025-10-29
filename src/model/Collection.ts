import { Book } from "./Book.js";
import { Permission } from "./Enums.js";
import { Config } from "./Config.js";
import { Resource } from "./Resource.js";
import { Bkper } from "./Bkper.js";
import * as CollectionService from "../service/collection-service.js";

/**
 * This class defines a Collection of [[Books]].
 *
 * @public
 */
export class Collection extends Resource<bkper.Collection> {
    private config?: Config;

    constructor(payload?: bkper.Collection, config?: Config) {
        super(payload);
        this.config = config;
    }

    /** @internal */
    public getConfig(): Config {
        return this.config || Bkper.globalConfig;
    }

    /**
     * Gets the unique identifier of this Collection.
     *
     * @returns The id of this Collection
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the name of this Collection.
     *
     * @returns The name of this Collection
     */
    public getName(): string | undefined {
        return this.payload.name;
    }

    /**
     * Sets the name of the Collection.
     *
     * @param name - The name to set
     *
     * @returns This Collection, for chaining
     */
    public setName(name: string): Collection {
        this.payload.name = name;
        return this;
    }

    /**
     * Gets the username of the owner of this Collection
     *
     * @returns The Collection's owner username
     */
    public getOwnerUsername(): string | undefined {
        return this.payload.ownerUsername;
    }

    /**
     * Gets the user permission for this Collection
     *
     * @returns The permission for the current user
     */
    public getPermission(): Permission | undefined {
        return this.payload.permission
            ? (this.payload.permission as Permission)
            : undefined;
    }

    /**
     * Gets all Books of this collection.
     *
     * @returns All Books of this collection
     */
    public getBooks(): Book[] {
        let books: Book[] = [];
        if (this.payload.books == null) {
            return books;
        }
        for (const bookPayload of this.payload.books) {
            let book = new Book(bookPayload);
            books.push(book);
        }
        return books;
    }

    /**
     * Adds Books to this Collection.
     *
     * @param books - The Books to add to this Collection
     *
     * @returns The added Book objects
     */
    public async addBooks(books: Book[]): Promise<Book[]> {
        const collectionId = this.getId();
        if (collectionId && books.length > 0) {
            const bookList: bkper.BookList = { items: books.map((b) => b.json()) };
            let addedBooks = await CollectionService.addBooksToCollection(
                collectionId,
                bookList,
                this.getConfig()
            );
            return addedBooks.map((book) => new Book(book));
        }
        return [];
    }

    /**
     * Removes Books from this Collection.
     *
     * @param books - The Books to remove from this Collection
     *
     * @returns The removed Book objects
     */
    public async removeBooks(books: Book[]): Promise<Book[]> {
        const collectionId = this.getId();
        if (collectionId && books.length > 0) {
            const bookList: bkper.BookList = { items: books.map((b) => b.json()) };
            let removedBooks = await CollectionService.removeBooksFromCollection(
                collectionId,
                bookList,
                this.getConfig()
            );
            return removedBooks.map((book) => new Book(book));
        }
        return [];
    }

    /**
     * Gets the last update date of this Collection
     *
     * @returns The Collection's last update timestamp, in milliseconds
     */
    public getUpdatedAt(): string | undefined {
        return this.payload.updatedAt;
    }

    /**
     * Performs create new Collection.
     *
     * @returns The created Collection object
     */
    public async create(): Promise<Collection> {
        this.payload = await CollectionService.createCollection(
            this.payload,
            this.getConfig()
        );
        return this;
    }

    /**
     * Performs update Collection, applying pending changes.
     *
     * @returns The updated Collection object
     */
    public async update(): Promise<Collection> {
        this.payload = await CollectionService.updateCollection(
            this.payload,
            this.getConfig()
        );
        return this;
    }

    /**
     * Performs delete Collection.
     *
     * @returns The list of Books the user has access to that were affected by the deletion of this Collection
     */
    public async remove(): Promise<Book[]> {
        let books = await CollectionService.deleteCollection(
            this.payload,
            this.getConfig()
        );
        return books.map((book) => new Book(book));
    }
}
