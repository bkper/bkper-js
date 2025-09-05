import { HttpApiRequest } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function getConversations(config: Config): Promise<bkper.Conversation[]> {
    const response = await new HttpApiRequest(`v5/apps/conversations`, config).setMethod('GET').fetch();
    return response.data?.items || [];
}

export async function createConversation(agentId: string, conversation: bkper.Conversation, config: Config): Promise<bkper.Conversation> {
    const response = await new HttpApiRequest(`v5/apps/${agentId}/conversations`, config).setMethod('POST').setPayload(conversation).fetch();
    return response.data;
}

export async function getMessages(conversationId: string, config: Config): Promise<bkper.Message[]> {
    const response = await new HttpApiRequest(`v5/apps/conversations/${conversationId}/messages`, config).setMethod('GET').fetch();
    return response.data?.items || [];
}

export async function createMessage(conversationId: string, message: bkper.Message, config: Config): Promise<bkper.Message> {
    const response = await new HttpApiRequest(`v5/apps/conversations/${conversationId}/messages`, config).setMethod('POST').setPayload(message).fetch();
    return response.data;
}

export async function streamMessage(conversationId: string, message: bkper.Message, config: Config): Promise<void> {
    new HttpApiRequest(`v5/apps/conversations/${conversationId}/stream`, config).setMethod('POST').setPayload(message).fetch();
}
