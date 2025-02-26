import { Book } from "../model/Book.js";
import { HttpBooksApiV5Request } from "./http-api-request.js";

export async function listEvents(book: Book, afterDate: string | null, beforeDate: string | null, onError: boolean, resourceId: string | null, limit: number, cursor?: string): Promise<bkper.EventList> {
  let request = new HttpBooksApiV5Request(`${book.getId()}/events`);
  request.addParam('after', afterDate);
  request.addParam('before', beforeDate);
  request.addParam('error', onError);
  request.addParam('resoureId', resourceId);
  request.addParam('limit', limit);
  if (cursor != null) {
    request.setHeader('cursor', cursor);
  }
  var response = await request.fetch();
  return response.data;
}

export async function replayBotResponse(book: Book, eventId: string, agentId: string): Promise<bkper.Event> {
  const response = await new HttpBooksApiV5Request(`${book.getId()}/events/${eventId}/responses/${agentId}`).setMethod('PUT').fetch();
  return response.data;
}

export async function deleteBotResponse(book: Book, eventId: string, agentId: string): Promise<bkper.Event> {
  const response = await new HttpBooksApiV5Request(`${book.getId()}/events/${eventId}/responses/${agentId}`).setMethod('DELETE').fetch();
  return response.data;
}

export async function replayEventsBatch(book: Book, eventList: bkper.EventList, errorsOnly?: boolean): Promise<void> {
  let request = new HttpBooksApiV5Request(`${book.getId()}/events/replay/batch`).setMethod('PATCH').setPayload(eventList);
  if (errorsOnly) {
    request.addParam('errorsOnly', errorsOnly);
  }
  await request.fetch();
}
