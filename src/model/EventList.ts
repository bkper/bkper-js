import { Book } from "./Book.js";
import { Event } from "./Event.js";

/**
 * A list associated with an event query.
 *
 * @public
 */
export class EventList {

  private payload: bkper.EventList;

  /** @internal */
  private book: Book;

  constructor(book: Book, payload: bkper.EventList) {
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
   * Gets the first Event in the list.
   *
   * @returns The first Event in the list
   */
  public getFirst(): Event | undefined {
    const events = this.getItems();
    return events.length > 0 ? events[0] : undefined;
  }

  /**
   * Get the total number of events in the list.
   *
   * @returns The total number of events
   */
  public size(): number {
    return this.payload.items?.length || 0;
  }

  /**
   * Get the events in the list.
   *
   * @returns An array of Event objects
   */
  public getItems(): Event[] {
    return this.payload.items?.map(event => new Event(this.book, event)) || [];
  }

}
