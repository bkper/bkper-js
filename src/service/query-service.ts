import { HttpBooksApiV5Request } from "./http-api-request.js";

export async function getSavedQueries(bookId: string): Promise<bkper.Query[]> {
  let response = await new HttpBooksApiV5Request(`${bookId}/queries`).setMethod('GET').fetch();
  return response?.data?.items || [];
}

export async function deleteSavedQuery(bookId: string, queryId: string): Promise<bkper.Query> {
  let response = await new HttpBooksApiV5Request(`${bookId}/queries/${queryId}`).setMethod('DELETE').fetch();
  return response.data;
}
