import { HttpBooksApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function getSavedQueries(bookId: string, config: Config): Promise<bkper.Query[]> {
    let response = await new HttpBooksApiV5Request(`${bookId}/queries`, config).setMethod('GET').fetch();
    return response?.data?.items || [];
}

export async function createSavedQuery(bookId: string, query: bkper.Query, config: Config): Promise<bkper.Query> {
    let response = await new HttpBooksApiV5Request(`${bookId}/queries`, config).setMethod('POST').setPayload(query).fetch();
    return response.data;
}

export async function updateSavedQuery(bookId: string, query: bkper.Query, config: Config): Promise<bkper.Query> {
    let response = await new HttpBooksApiV5Request(`${bookId}/queries`, config).setMethod('PUT').setPayload(query).fetch();
    return response.data;
}

export async function deleteSavedQuery(bookId: string, queryId: string, config: Config): Promise<bkper.Query> {
    let response = await new HttpBooksApiV5Request(`${bookId}/queries/${queryId}`, config).setMethod('DELETE').fetch();
    return response.data;
}
