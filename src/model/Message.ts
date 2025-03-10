import { Agent } from "./Agent.js";
import { Conversation } from "./Conversation.js";
import { User } from "./User.js";

/**
 * Defines a Message on Bkper.
 * 
 * A Message is a building block of a [[Conversation]].
 * 
 * @public
 */
export class Message {

    public payload: bkper.Message;

    /** @internal */
    private conversation: Conversation;

    constructor(conversation: Conversation, payload?: bkper.Message) {
        this.conversation = conversation;
        this.payload = payload || {};
    }

    /**
     * @returns The wrapped plain json object
     */
    public json(): bkper.Message {
        return { ...this.payload };
    }

    /**
     * 
     * @returns The Message universal identifier
     */
    public getId(): string | undefined {
        return this.payload.id;
    }   

    /**
     * 
     * @returns The Agent who created the Message, if any
     */
    public getAgent(): Agent | undefined {
        return this.payload.agent ? new Agent(this.payload.agent) : undefined;
    }

    /**
     * 
     * @returns The User who created the Message, if any
     */
    public getUser(): User | undefined {
        return this.payload.user ? new User(this.payload.user) : undefined;
    }

    /**
     * 
     * @returns The Date the Message was created
     */
    public getCreatedAt(): Date | undefined {
        return this.payload.createdAt ? new Date(this.payload.createdAt) : undefined;
    }
        
    /**
     * 
     * @returns The content text of the Message
     */
    public getContent(): string | undefined {
        return this.payload.content;
    }

}
