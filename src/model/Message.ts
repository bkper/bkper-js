import * as ConversationService from "../service/conversation-service.js";
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

    /** @internal */
    private parent?: Message;

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
     * @returns The Agent associated with the Message, in any
     */
    public getAgent(): Agent | undefined {
        return this.payload.agent ? new Agent(this.payload.agent) : undefined;
    }

    /**
     * 
     * @returns The Conversation of the Message
     */
    public getConversation(): Conversation {
        return this.conversation;
    }

    /**
     * 
     * @returns The User associated with the Message
     */
    public getUser(): User | undefined {
        return this.payload.user ? new User(this.payload.user) : undefined;
    }

    /**
     * 
     * @returns The Date the Message was created
     */
    public getCreatedAt(): Date | undefined {
        return this.payload.createdAt ? new Date(new Number(this.payload.createdAt).valueOf()) : undefined;
    }

    /**
     * 
     * @returns The text content of the Message
     */
    public getContent(): string | undefined {
        return this.payload.content;
    }

    /**
     * 
     * @param content The text content of the Message
     * 
     * @returns This Message, for chaining
     */
    public setContent(content: string): Message {
        this.payload.content = content;
        return this;
    }

    /**
     * @returns The custom properties stored in this Message
     */
    public getProperties(): { [key: string]: string } {
        return this.payload.properties != null ? { ...this.payload.properties } : {};
    }

    /**
     * Sets the custom properties of the Message
     * 
     * @param properties - Object with key/value pair properties
     * 
     * @returns This Message, for chainning. 
     */
    public setProperties(properties: { [key: string]: string }): Message {
        this.payload.properties = { ...properties };
        return this;
    }

    /**
     * Gets the property value for given keys. First property found will be retrieved.
     * 
     * @param keys - The property key
     * 
     * @returns The retrieved property value
     */
    public getProperty(...keys: string[]): string | undefined {
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            let value = this.payload.properties != null ? this.payload.properties[key] : null;
            if (value != null && value.trim() != '') {
                return value;
            }
        }
        return undefined;
    }

    /**
     * Sets a custom property in the Message.
     * 
     * @param key - The property key
     * @param value - The property value
     * 
     * @returns This Message, for chainning. 
     */
    public setProperty(key: string, value: string | null): Message {
        if (key == null || key.trim() == '') {
            return this;
        }
        if (this.payload.properties == null) {
            this.payload.properties = {};
        }
        if (!value) {
            value = '';
        }
        this.payload.properties[key] = value;
        return this;
    }

    /**
     * Deletes a custom property from the Message.
     * 
     * @param key - The property key
     * 
     * @returns This Message, for chainning.
     */
    public deleteProperty(key: string): Message {
        this.setProperty(key, null);
        return this;
    }

    /**
     * Creates the Message and receives the synchronous Agent response.
     * 
     * @returns The Agent response Message, with the created Message as its parent
     */
    public async create(): Promise<Message> {
        const conversationId = this.conversation.getId();
        if (!conversationId) {
            throw new Error('Conversation id null!');
        }
        const responsePayload = await ConversationService.createMessage(conversationId, this.payload);
        if (responsePayload.parent) {
            this.payload = responsePayload.parent;
        }
        const responseMessage = new Message(this.conversation, responsePayload);
        this.conversation.updateMessagesCache(this);
        this.conversation.updateMessagesCache(responseMessage);
        // Set conversation updatedAt
        if (responsePayload.createdAt) {
            this.conversation.setUpdatedAt(responsePayload.createdAt);
        }
        return this;
    }

    /**
     * Streams the Message to the Bkper API.
     */
    public async stream(): Promise<void> {
        const conversationId = this.conversation.getId();
        if (!conversationId) {
            throw new Error('Conversation id null!');
        }
        ConversationService.streamMessage(conversationId, this.payload);
    }

}
