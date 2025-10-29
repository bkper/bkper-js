import { Book } from "../model/Book.js";
import { HttpBooksApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function listEvents(book: Book, afterDate: string | null, beforeDate: string | null, onError: boolean, resourceId: string | null, limit: number, cursor: string | undefined, config: Config): Promise<bkper.EventList> {
    let request = new HttpBooksApiV5Request(`${book.getId()}/events`, config);
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

export async function replayBotResponse(book: Book, eventId: string, agentId: string, config: Config): Promise<bkper.Event> {
    const response = await new HttpBooksApiV5Request(`${book.getId()}/events/${eventId}/responses/${agentId}`, config).setMethod('PUT').fetch();
    return response.data;
}

export async function deleteBotResponse(book: Book, eventId: string, agentId: string, config: Config): Promise<bkper.Event> {
    const response = await new HttpBooksApiV5Request(`${book.getId()}/events/${eventId}/responses/${agentId}`, config).setMethod('DELETE').fetch();
    return response.data;
}

export async function replayEventsBatch(book: Book, eventList: bkper.EventList, errorsOnly: boolean | undefined, config: Config): Promise<void> {
    let request = new HttpBooksApiV5Request(`${book.getId()}/events/replay/batch`, config).setMethod('PATCH').setPayload(eventList);
    if (errorsOnly) {
        request.addParam('errorsOnly', errorsOnly);
    }
    await request.fetch();
}

export async function getBacklog(book: Book, config: Config): Promise<bkper.Backlog> {
    const response = await new HttpBooksApiV5Request(`${book.getId()}/events/backlog`, config).setMethod("GET").fetch();
    return response.data;
}
