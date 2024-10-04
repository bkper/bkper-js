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

  public payload: bkper.File;
  
  /** @internal */
  private book: Book;

  constructor(book: Book, payload?: bkper.File) {
    this.book = book;
    this.payload = payload || {};
  }

  /**
   * @returns An immutable copy of the json payload
   */
  public json(): bkper.File {
    return { ...this.payload };
  }

  /**
   * Gets the File id
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * Gets the File name
   */
  public getName(): string | undefined {
    return this.payload.name;
  }

  /**
   * 
   * Sets the name of the File.
   * 
   * @returns This File, for chainning.
   */    
  public setName(name: string): File {
    this.payload.name = name;
    return this;
  }  

  /**
   * Gets the File content type
   */
  public getContentType(): string | undefined {
    return this.payload.contentType;
  }

  /**
   * 
   * Sets the File content type.
   * 
   * @returns This File, for chainning.
   */    
  public setContentType(contentType: string): File {
    this.payload.contentType = contentType;
    return this;
  }    

  /**
   * Gets the file content Base64 encoded
   */
  public async getContent(): Promise<string | undefined> {
    const id = this.getId();
    if (this.getId() != null && (this.payload == null || this.payload.content == null) && this.book && id) {
      this.payload = await FileService.getFile(this.book.getId(), id);
    }
    return this.payload.content;
  }

  /**
   * 
   * Sets the File content Base64 encoded.
   * 
   * @returns This File, for chainning.
   */    
  public setContent(content: string): File {
    this.payload.content = content;
    return this;
  } 
 
  /**
   * Gets the file serving url for accessing via browser
   */
  public getUrl(): string | undefined {
    return this.payload.url;
  }

  /**
   * Gets the file size in bytes
   */  
  public getSize(): number | undefined {
    return this.payload.size;
  }


  /**
   * Perform create new File.
   */
  public async create(): Promise<File> {
    if (this.book) {
      this.payload = await FileService.createFile(this.book.getId(), this.payload);
    }
    return this;
  }

}