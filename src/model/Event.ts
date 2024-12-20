/**
 * Represents an Event in the system.
 * 
 * @public
 */
export class Event {

  public payload: bkper.Event;

  constructor(payload?: bkper.Event) {
    this.payload = payload || {};
  }

  /**
   * @returns The wrapped plain json object
   */
  public json(): bkper.Event {
    return { ...this.payload };
  }

}
