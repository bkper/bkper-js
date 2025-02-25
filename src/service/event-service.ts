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

export async function replayEvent(book: Book, eventId: string, botResponse: bkper.BotResponse): Promise<bkper.BotResponse> {
  const response = await new HttpBooksApiV5Request(`${book.getId()}/events/${eventId}/replay`).setPayload(botResponse).fetch();
  return response.data;
}

export async function replayEventsBatch(book: Book, eventList: bkper.EventList, errorsOnly?: boolean): Promise<void> {
  let request = new HttpBooksApiV5Request(`${book.getId()}/events/replay/batch`).setPayload(eventList);
  if (errorsOnly) {
    request.addParam('errorsOnly', errorsOnly);
  }
  const response = await request.fetch();
  return response.data;
}
