import { HttpBooksApiV5Request } from "./http-api-request.js";
import axios from 'axios';

export async function getBalances(bookId: string, query: string): Promise<bkper.Balances> {
  var response = await new HttpBooksApiV5Request(`${bookId}/balances`).addParam('query', query).addParam('time', Date.now()).fetch();

  if (response.data.balancesUrl) {
    response = await axios.get(response.data.balancesUrl);
  }

  return response.data;
}

