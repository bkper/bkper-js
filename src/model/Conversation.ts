import * as ConversationService from "../service/conversation-service.js";
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
    private agent: Agent;

    /** @internal */
    private messages?: Message[];

    constructor(agent: Agent, payload?: bkper.Conversation) {
        this.agent = agent;
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
     * @returns The Agent associated to this Conversation
     */
    public getAgent(): Agent {
        return this.agent;
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
     * @returns The Messages in this Conversation
     */
    public async getMessages(): Promise<Message[]> {
        if (this.messages != null) {
            return this.messages;
        }
        const conversationId = this.getId();
        if (conversationId) {
            const messagePayloads: bkper.Message[] = await ConversationService.getMessages(conversationId);
            this.payload.messages = messagePayloads;
            this.messages = messagePayloads.map(message => new Message(this, message));
        }
        return this.messages || [];
    }

    /**
     * 
     * @param message The Message to add to this Conversation
     * 
     * @returns This Conversation, for chaining
     */
    public addMessage(message: Message): Conversation {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(message);
        this.payload.messages = this.messages.map(message => message.json());
        return this;
    }

    /**
     * 
     * @return The updated Conversation object
     */
    public async send(): Promise<Conversation> {
        const agentId = this.agent.getId();
        if (agentId) {
            const updatedPayload = await ConversationService.send(agentId, this.payload);
            this.payload = updatedPayload;
            if (updatedPayload.agent) {
                this.agent = new Agent(updatedPayload.agent);
            }
            if (updatedPayload.messages) {
                if (!this.messages) {
                    this.messages = [];
                }
                for (const messagePayload of updatedPayload.messages) {
                    this.messages.push(new Message(this, messagePayload));
                }
                this.payload.messages = this.messages.map(message => message.json());
            }
        }
        return this;
    }

}
