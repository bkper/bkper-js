import { HttpApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function loadCollections(config: Config): Promise<bkper.Collection[]> {
  let response = await new HttpApiV5Request('collections', config).fetch();
  return response?.data?.items || [];
}

export async function createCollection(payload: bkper.Collection, config: Config): Promise<bkper.Collection> {
  let response = await new HttpApiV5Request('collections', config).setMethod('POST').setPayload(payload).fetch();
  return response.data;
}

export async function updateCollection(payload: bkper.Collection, config: Config): Promise<bkper.Collection> {
  let response = await new HttpApiV5Request('collections', config).setMethod('PUT').setPayload(payload).fetch();
  return response.data;
}

export async function deleteCollection(payload: bkper.Collection, config: Config): Promise<bkper.Book[]> {
  let response = await new HttpApiV5Request(`collections/${payload.id}`, config).setMethod('DELETE').fetch();
  return response?.data?.items || [];
}

export async function addBooksToCollection(collectionId: string, payload: bkper.BookList, config: Config): Promise<bkper.Book[]> {
  let response = await new HttpApiV5Request(`collections/${collectionId}/books/add`, config).setMethod('PATCH').setPayload(payload).fetch();
  return response?.data?.items || [];
}

export async function removeBooksFromCollection(collectionId: string, payload: bkper.BookList, config: Config): Promise<bkper.Book[]> {
  let response = await new HttpApiV5Request(`collections/${collectionId}/books/remove`, config).setMethod('PATCH').setPayload(payload).fetch();
  return response?.data?.items || [];
}
