import { Book } from "./Book.js";

/**
 * This class defines a Collection of [[Books]].
 * 
 * @public
 */
export class Collection {

  /** @internal */
  private wrapped: bkper.Collection
  
  /** @internal */
  constructor(json?: bkper.Collection) {
    this.wrapped = json || {};
  }

  /**
   * @returns The id of this Collection
   */
  public getId(): string | undefined {
    return this.wrapped.id;
  }

  /**
   * @returns The name of this Collection
   */
  public getName(): string | undefined {
    return this.wrapped.name;
  }

  /**
   * @returns All Books of this collection.
   */
  public getBooks(): Book[] {
    let books: Book[] = [];
    if (this.wrapped.books == null) {
      return books;
    }
    for (const bookPayload of this.wrapped.books) {
      let book = new Book(bookPayload);
      books.push(book);
    }
    return books;
  }

  /**
   * @returns The wrapped plain json object
   */
  public json(): bkper.Collection {
    return this.wrapped;
  }

}
