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
    private messagesMap?: Map<string, Message>;

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
        return this.payload.createdAt ? new Date(new Number(this.payload.createdAt).valueOf()) : undefined;
    }

    /**
     * 
     * @returns The Date the Conversation was last updated
     */
    public getUpdatedAt(): Date | undefined {
        return this.payload.updatedAt ? new Date(new Number(this.payload.updatedAt).valueOf()) : undefined;
    }

    /**
     * Gets the Messages that compose this Conversation
     * 
     * @returns The Messages in this Conversation
     */
    public async getMessages(): Promise<Message[]> {
        if (this.messagesMap != null) {
            return Array.from(this.messagesMap.values());
        }
        const conversationId = this.getId();
        if (!conversationId) {
            throw new Error('Conversation id null!');
        }
        if (!this.messagesMap) {
            this.messagesMap = new Map<string, Message>();
        }
        const messagePayloads: bkper.Message[] = await ConversationService.getMessages(conversationId);
        for (const payload of messagePayloads) {
            this.updateMessagesCache(new Message(this, payload));
        }
        return Array.from(this.messagesMap.values());
    }

    /** @internal */
    updateMessagesCache(message: Message): void {
        const messageId = message.getId();
        if (messageId) {
            if (!this.messagesMap) {
                this.messagesMap = new Map<string, Message>();
            }
            this.messagesMap.set(messageId, message);
        }
    }

    /**
     * Performs create Conversation
     * 
     * @returns The created Conversation object
     */
    public async create(): Promise<Conversation> {
        const agentId = this.agent.getId();
        if (!agentId) {
            throw new Error('Agent id null!');
        }
        this.payload = await ConversationService.createConversation(agentId, this.payload);
        // Update agent
        if (this.payload.agent) {
            this.agent = new Agent(this.payload.agent);
        }
        return this;
    }

}
