import { Agent } from "./Agent.js";
import { BotResponse } from "./BotResponse.js";
import { EventType } from "./Enums.js";
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
  private botResponses?: BotResponse[];

  constructor(payload?: bkper.Event) {
    this.payload = payload || {};
  }

  /**
   * @returns The wrapped plain json object
   */
  public json(): bkper.Event {
    return { ...this.payload };
  }

  /**
   * @returns The user who performed the Event
   */
  public getUser(): User | undefined {
    return this.payload.user ? new User(this.payload.user) : undefined;
  }

  /**
   * @returns The user who performed the Event
   */
  public getAgent(): Agent | undefined {
    return this.payload.agent ? new Agent(this.payload.agent) : undefined;
  }

  /**
   * @returns The date the Event was created
   */
  public getCreatedAt(): Date | undefined {
    return this.payload.createdAt ? new Date(new Number(this.payload.createdAt).valueOf()) : undefined;
  }

  /**
   * @returns The type of the Event
   */
  public getType(): EventType | undefined {
    return this.payload.type as EventType | undefined;
  }

  /**
   * @returns The Bot Responses associated to this Event
   */
  public getBotResponses(): BotResponse[] {
    if (this.botResponses !== undefined) {
      return this.botResponses;
    }
    let botResponses: BotResponse[] = [];
    if (this.payload.botResponses) {
      for (const botResponse of this.payload.botResponses) {
        botResponses.push(new BotResponse(botResponse as bkper.BotResponse));
      }
    }
    this.botResponses = botResponses;
    return this.botResponses;
  }

}
