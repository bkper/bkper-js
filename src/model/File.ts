import { Book } from "./Book.js";
import { Config } from "./Config.js";
import * as FileService from "../service/file-service.js";
import { ResourceProperty } from "./ResourceProperty.js";

/**
 *
 * This class defines a File uploaded to a [[Book]].
 *
 * A File can be attached to a [[Transaction]] or used to import data.
 *
 * @public
 */
export class File extends ResourceProperty<bkper.File> {

    /** @internal */
    book: Book;

    constructor(book: Book, payload?: bkper.File) {
        super(payload || { createdAt: `${Date.now()}` });
        this.book = book;
    }

    /**
     * Gets the Book this File belongs to.
     *
     * @returns The Book instance that owns this File
     */
    public getBook(): Book {
        return this.book;
    }

    /** @internal */
    public getConfig(): Config {
        return this.book.getConfig();
    }

    /**
     * Gets the File id.
     *
     * @returns The File id
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the File name.
     *
     * @returns The File name
     */
    public getName(): string | undefined {
        return this.payload.name;
    }

    /**
     * Sets the name of the File.
     *
     * @param name - The name to set
     *
     * @returns This File, for chaining
     */
    public setName(name: string): File {
        this.payload.name = name;
        return this;
    }

    /**
     * Gets the File content type.
     *
     * @returns The File content type
     */
    public getContentType(): string | undefined {
        return this.payload.contentType;
    }

    /**
     * Sets the File content type.
     *
     * @param contentType - The content type to set
     *
     * @returns This File, for chaining
     */
    public setContentType(contentType: string): File {
        this.payload.contentType = contentType;
        return this;
    }

    /**
     * Gets the file content Base64 encoded.
     *
     * @returns The file content Base64 encoded
     */
    public async getContent(): Promise<string | undefined> {
        const id = this.getId();
        if (
            this.getId() != null &&
            (this.payload == null || this.payload.content == null) &&
            this.book &&
            id
        ) {
            this.payload = await FileService.getFile(
                this.book.getId(),
                id,
                this.getConfig()
            );
        }
        return this.payload.content;
    }

    /**
     * Sets the File content Base64 encoded.
     *
     * @param content - The content to set (Base64 encoded)
     *
     * @returns This File, for chaining
     */
    public setContent(content: string): File {
        this.payload.content = content;
        return this;
    }

    /**
     * Gets the file serving url for accessing via browser.
     *
     * @returns The file serving url
     */
    public getUrl(): string | undefined {
        return this.payload.url;
    }

    /**
     * Gets the file size in bytes.
     *
     * @returns The file size in bytes
     */
    public getSize(): number | undefined {
        return this.payload.size;
    }



    /**
     * Perform create new File.
     *
     * @returns The created File object
     */
    public async create(): Promise<File> {
        this.payload = await FileService.createFile(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        return this;
    }

    /**
     * Perform update File, applying pending changes.
     *
     * @returns The updated File object
     */
    public async update(): Promise<File> {
        this.payload = await FileService.updateFile(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        return this;
    }

}
