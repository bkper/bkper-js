import { Book } from "./Book.js";

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
}
