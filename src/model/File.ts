import { Book } from "./Book.js";
import { Config } from "./Config.js";
import * as FileService from "../service/file-service.js";
import { Resource } from "./Resource.js";

/**
 *
 * This class defines a File uploaded to a [[Book]].
 *
 * A File can be attached to a [[Transaction]] or used to import data.
 *
 * @public
 */
export class File extends Resource<bkper.File> {
  /** @internal */
  private book: Book;

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
   * Gets the custom properties stored in this File.
   *
   * @returns The custom properties object
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null
      ? { ...this.payload.properties }
      : {};
  }

  /**
   * Sets the custom properties of the File.
   *
   * @param properties - Object with key/value pair properties
   *
   * @returns This File, for chaining
   */
  public setProperties(properties: { [key: string]: string }): File {
    this.payload.properties = { ...properties };
    return this;
  }

  /**
   * Gets the property value for given keys. First property found will be retrieved.
   *
   * @param keys - The property key
   *
   * @returns The property value or undefined if not found
   */
  public getProperty(...keys: string[]): string | undefined {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value =
        this.payload.properties != null ? this.payload.properties[key] : null;
      if (value != null && value.trim() != "") {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Sets a custom property in the File.
   *
   * @param key - The property key
   * @param value - The property value
   *
   * @returns This File, for chaining
   */
  public setProperty(key: string, value: string | null): File {
    if (key == null || key.trim() == "") {
      return this;
    }
    if (this.payload.properties == null) {
      this.payload.properties = {};
    }
    if (!value) {
      value = "";
    }
    this.payload.properties[key] = value;
    return this;
  }

  /**
   * Deletes a custom property.
   *
   * @param key - The property key
   *
   * @returns This File, for chaining
   */
  public deleteProperty(key: string): File {
    this.setProperty(key, null);
    return this;
  }

  /**
   * Perform create new File.
   *
   * @returns The created File object
   */
  public async create(): Promise<File> {
    if (this.book) {
      this.payload = await FileService.createFile(
        this.book.getId(),
        this.payload,
        this.getConfig()
      );
    }
    return this;
  }
}
