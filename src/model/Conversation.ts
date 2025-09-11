import * as ConversationService from "../service/conversation-service.js";
import { Agent } from "./Agent.js";
import { Message } from "./Message.js";
import { Resource } from "./Resource.js";
import { Config } from "./Config.js";
import { Bkper } from "./Bkper.js";

/**
 * Defines a Conversation on Bkper.
 *
 * A Conversation represents an interaction between [[Users]] and [[Apps]].
 *
 * @public
 */
export class Conversation extends Resource<bkper.Conversation> {
  /** @internal */
  private agent: Agent;

  /** @internal */
  private messagesMap?: Map<string, Message>;

  private config?: Config;

  constructor(agent: Agent, payload?: bkper.Conversation, config?: Config) {
    super(payload || {});
    this.agent = agent;
    this.config = config;
  }

  /** @internal */
  public getConfig(): Config {
    return this.config || Bkper.globalConfig;
  }

  /**
   * Gets the Agent associated to this Conversation.
   *
   * @returns The Agent associated to this Conversation
   */
  public getAgent(): Agent {
    return this.agent;
  }

  /**
   * Gets the Conversation universal identifier.
   *
   * @returns The Conversation universal identifier
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * Gets the title of the Conversation.
   *
   * @returns The title of the Conversation
   */
  public getTitle(): string | undefined {
    return this.payload.title;
  }

  /**
   * Gets the Date the Conversation was created.
   *
   * @returns The Date the Conversation was created
   */
  public getCreatedAt(): Date | undefined {
    return this.payload.createdAt
      ? new Date(new Number(this.payload.createdAt).valueOf())
      : undefined;
  }

  /**
   * Gets the Date the Conversation was last updated.
   *
   * @returns The Date the Conversation was last updated
   */
  public getUpdatedAt(): Date | undefined {
    return this.payload.updatedAt
      ? new Date(new Number(this.payload.updatedAt).valueOf())
      : undefined;
  }

  /**
   * Gets the Messages that compose this Conversation.
   *
   * @returns The Messages in this Conversation
   */
  public async getMessages(): Promise<Message[]> {
    if (this.messagesMap != null) {
      return Array.from(this.messagesMap.values());
    }
    const conversationId = this.getId();
    if (!conversationId) {
      throw new Error("Conversation id null!");
    }
    if (!this.messagesMap) {
      this.messagesMap = new Map<string, Message>();
    }
    const messagePayloads: bkper.Message[] =
      await ConversationService.getMessages(conversationId, this.getConfig());
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

  /** @internal */
  setUpdatedAt(updatedAtMs: string): void {
    this.payload.updatedAt = updatedAtMs;
  }

  /**
   * Performs create Conversation.
   *
   * @returns The created Conversation object
   */
  public async create(): Promise<Conversation> {
    const agentId = this.agent.getId();
    if (!agentId) {
      throw new Error("Agent id null!");
    }
    this.payload = await ConversationService.createConversation(
      agentId,
      this.payload,
      this.getConfig()
    );
    // Update agent
    if (this.payload.agent) {
      this.agent = new Agent(this.payload.agent);
    }
    return this;
  }
}
