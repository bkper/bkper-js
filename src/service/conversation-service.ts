import { HttpApiRequest } from "./http-api-request.js";

export async function getMessages(conversationId: string): Promise<bkper.Message[]> {
  const response = await new HttpApiRequest(`v5/apps/conversations/${conversationId}/messages`).setMethod('GET').fetch();
  return response.data?.items || [];
}
