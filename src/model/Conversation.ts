import { Agent } from "./Agent.js";
import { Message } from "./Message.js";

/**
 * Defines a Conversation on Bkper.
 * 
 * A Conversation represents an interaction between [[Users]] and [[Apps]].
 * 
 * @public
 */
export class Conversation {

    public payload: bkper.Conversation;

    /** @internal */
    private messages?: Message[];

    constructor(payload?: bkper.Conversation) {
        this.payload = payload || {};
    }

    /**
     * @returns The wrapped plain json object
     */
    public json(): bkper.Conversation {
        return { ...this.payload };
    }

    /**
     * 
     * @returns The Conversation universal identifier
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * 
     * @returns The title of the Conversation
     */
    public getTitle(): string | undefined {
        return this.payload.title;
    }

    /**
     * 
     * @returns The Agent associated to this Conversation
     */
    public getAgent(): Agent | undefined {
        return this.payload.agent ? new Agent(this.payload.agent) : undefined;
    }

    /**
     * 
     * @returns The Date the Conversation was created
     */
    public getCreatedAt(): Date | undefined {
        return this.payload.createdAt ? new Date(this.payload.createdAt) : undefined;
    }

    /**
     * 
     * @returns The Date the Conversation was last updated
     */
    public getUpdatedAt(): Date | undefined {
        return this.payload.updatedAt ? new Date(this.payload.updatedAt) : undefined;
    }

    /**
     * 
     * @returns The Messages associated to this Conversation
     */
    public getMessages(): Message[] {
        if (this.messages !== undefined) {
            return this.messages;
        }
        let messages: Message[] = [];
        if (this.payload.messages) {
            for (const message of this.payload.messages) {
                messages.push(new Message(this, message));
            }
        }
        this.messages = messages;
        return this.messages;
    }

}
