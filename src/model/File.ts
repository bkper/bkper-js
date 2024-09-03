import { Book } from "./Book.js";
import * as FileService from '../service/file-service.js';

/**
 * 
 * This class defines a File uploaded to a [[Book]].
 * 
 * A File can be attached to a [[Transaction]] or used to import data.
 * 
 * @public
 */
export class File {
  
  /** @internal */
  private book: Book;

  /** @internal */
  private wrapped: bkper.File;

  constructor(book: Book, json?: bkper.File) {
    this.book = book;
    this.wrapped = json || {};
  }

  /**
   * 
   * @returns The wrapped plain json object
   */
  public json(): bkper.Transaction {
    return this.wrapped;
  }

  /**
   * Gets the File id
   */
  public getId(): string | undefined {
    return this.wrapped.id;
  }

  /**
   * Gets the File name
   */
  public getName(): string | undefined {
    return this.wrapped.name;
  }

  /**
   * 
   * Sets the name of the File.
   * 
   * @returns This File, for chainning.
   */    
  public setName(name: string): File {
    this.wrapped.name = name;
    return this;
  }  

  /**
   * Gets the File content type
   */
  public getContentType(): string | undefined {
    return this.wrapped.contentType;
  }

  /**
   * 
   * Sets the File content type.
   * 
   * @returns This File, for chainning.
   */    
  public setContentType(contentType: string): File {
    this.wrapped.contentType = contentType;
    return this;
  }    

  /**
   * Gets the file content Base64 encoded
   */
  public async getContent(): Promise<string | undefined> {
    const id = this.getId();
    if (this.getId() != null && (this.wrapped == null || this.wrapped.content == null) && this.book && id) {
      this.wrapped = await FileService.getFile(this.book.getId(), id);
    }
    return this.wrapped.content;
  }

  /**
   * 
   * Sets the File content Base64 encoded.
   * 
   * @returns This File, for chainning.
   */    
  public setContent(content: string): File {
    this.wrapped.content = content;
    return this;
  } 
 
  /**
   * Gets the file serving url for accessing via browser
   */
  public getUrl(): string | undefined {
    return this.wrapped.url;
  }

  /**
   * Gets the file size in bytes
   */  
  public getSize(): number | undefined {
    return this.wrapped.size;
  }


  /**
   * Perform create new File.
   */
  public async create(): Promise<File> {
    if (this.book) {
      this.wrapped = await FileService.createFile(this.book.getId(), this.wrapped);
    }
    return this;
  }

}