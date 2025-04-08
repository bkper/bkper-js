import { HttpApiRequest } from "./http-api-request.js";

export async function getConversations(): Promise<bkper.Conversation[]> {
    const response = await new HttpApiRequest(`v5/apps/conversations`).setMethod('GET').fetch();
    return response.data?.items || [];
}

export async function createConversation(agentId: string, conversation: bkper.Conversation): Promise<bkper.Conversation> {
    const response = await new HttpApiRequest(`v5/apps/${agentId}/conversations`).setMethod('POST').setPayload(conversation).fetch();
    return response.data;
}

export async function getMessages(conversationId: string): Promise<bkper.Message[]> {
    const response = await new HttpApiRequest(`v5/apps/conversations/${conversationId}/messages`).setMethod('GET').fetch();
    return response.data?.items || [];
}

export async function createMessage(conversationId: string, message: bkper.Message): Promise<bkper.Message> {
    const response = await new HttpApiRequest(`v5/apps/conversations/${conversationId}/messages`).setMethod('POST').setPayload(message).fetch();
    return response.data;
}

export async function streamMessage(conversationId: string, message: bkper.Message): Promise<void> {
    new HttpApiRequest(`v5/apps/conversations/${conversationId}/stream`).setMethod('POST').setPayload(message).fetch();
}
