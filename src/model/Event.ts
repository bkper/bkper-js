import { Agent } from "./Agent.js";
import { Book } from "./Book.js";
import { BotResponse } from "./BotResponse.js";
import { BotResponseType, EventType } from "./Enums.js";
import { User } from "./User.js";

/**
 * 
 * This class defines an Event from a [[Book]].
 *
 * An event is an object that represents an action (such as posting or deleting a [[Transaction]]) made by an actor (such as a user or a [Bot](https://bkper.com/apps) acting on behalf of a user).
 * 
 * @public
 */
export class Event {

  public payload: bkper.Event;

  /** @internal */
  private book: Book;

  /** @internal */
  private botResponses?: BotResponse[];

  constructor(book: Book, payload?: bkper.Event) {
    this.book = book;
    this.payload = payload || {};
  }

  /**
   * Gets an immutable copy of the JSON payload for this Event.
   *
   * @returns The wrapped plain json object
   */
  public json(): bkper.Event {
    return { ...this.payload };
  }

  /**
   * Gets the book in which the Event was created.
   *
   * @returns The book in which the Event was created
   */
  public getBook(): Book {
    return this.book;
  }

  /**
   * Gets the id of the Event.
   *
   * @returns The id of the Event
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * Gets the user who performed the Event.
   *
   * @returns The user who performed the Event
   */
  public getUser(): User | undefined {
    return this.payload.user ? new User(this.payload.user) : undefined;
  }

  /**
   * Gets the Agent who performed the Event.
   *
   * @returns The Agent who performed the Event
   */
  public getAgent(): Agent | undefined {
    return this.payload.agent ? new Agent(this.payload.agent) : undefined;
  }

  /**
   * Gets the date the Event was created.
   *
   * @returns The date the Event was created
   */
  public getCreatedAt(): Date | undefined {
    return this.payload.createdAt ? new Date(new Number(this.payload.createdAt).valueOf()) : undefined;
  }

  /**
   * Gets the type of the Event.
   *
   * @returns The type of the Event
   */
  public getType(): EventType | undefined {
    return this.payload.type as EventType | undefined;
  }

  /**
   * Gets the Bot Responses associated to this Event.
   *
   * @returns The Bot Responses associated to this Event
   */
  public getBotResponses(): BotResponse[] {
    if (this.botResponses !== undefined) {
      return this.botResponses;
    }
    let botResponses: BotResponse[] = [];
    if (this.payload.botResponses) {
      for (const botResponse of this.payload.botResponses) {
        botResponses.push(new BotResponse(this, botResponse as bkper.BotResponse));
      }
    }
    this.botResponses = botResponses;
    return this.botResponses;
  }

  /**
   * Checks if this Event has at least one Bot Response of type ERROR.
   *
   * @returns True if this Event has at least one Bot Response of type ERROR
   */
  public hasErrorResponse(): boolean {
    const botResponses = this.getBotResponses();
    for (const botResponse of botResponses) {
      if (botResponse.getType() === BotResponseType.ERROR) {
        return true;
      }
    }
    return false;
  }

}
