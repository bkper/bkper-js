import { HttpBooksApiV5Request } from "./http-api-request.js";

export async function getBalances(bookId: string, query: string): Promise<bkper.Balances> {
  var response = await new HttpBooksApiV5Request(`${bookId}/balances`).addParam('query', query).addParam('time', Date.now()).fetch();

  if (response.data.balancesUrl) {
    const fetchResponse = await fetch(response.data.balancesUrl);
    const data = await fetchResponse.json();
    response = { data: data, status: fetchResponse.status };
  }

  return response.data;
}

