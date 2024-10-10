import { Book } from "./Book.js";
import { Permission } from "./Enums.js";

/**
 * This class defines a Collection of [[Books]].
 * 
 * @public
 */
export class Collection {
  public payload: bkper.Collection;

  constructor(payload?: bkper.Collection) {
    this.payload = payload || {};
  }

  /**
   * @returns The wrapped plain json object
   */
  public json(): bkper.Collection {
    return { ...this.payload };
  }

  /**
   * @returns The id of this Collection
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * @returns The name of this Collection
   */
  public getName(): string | undefined {
    return this.payload.name;
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
    return this.payload.permission ? (this.payload.permission as Permission) : undefined;
  }

  /**
   * @returns All Books of this collection.
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
   * Gets the last update date of this Collection
   * 
   * @returns The Collection's last update timestamp, in milliseconds
   */
  public getUpdatedAt(): string | undefined {
    return this.payload.updatedAt;
  }

}
