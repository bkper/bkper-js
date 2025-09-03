import { HttpBooksApiV5Request } from "./http-api-request.js";
import { HttpRequest } from "./http-request.js";

export async function getBalances(bookId: string, query: string): Promise<bkper.Balances> {

  let response = await new HttpBooksApiV5Request(`${bookId}/balances`).addParam('query', query).addParam('time', Date.now()).fetch();

  const balancesUrl = response.data?.balancesUrl; // Expected for large payloads
  if (balancesUrl) {
    const balancesResponse = await new HttpRequest(balancesUrl).setMethod('GET').execute();
    response = { data: balancesResponse.data, status: balancesResponse.status };
  }

  return response.data;

}
