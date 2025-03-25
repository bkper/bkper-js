import { HttpBooksApiV5Request } from './http-api-request.js';

export async function createAccount(bookId: string, account: bkper.Account): Promise<bkper.Account> {
  var response = await new HttpBooksApiV5Request(`${bookId}/accounts`).setMethod('POST').setPayload(account).fetch();
  return response.data;
}

export async function createAccounts(bookId: string, payload: bkper.AccountList): Promise<bkper.Account[]> {
  const response = await new HttpBooksApiV5Request(`${bookId}/accounts/batch`).setMethod('POST').setPayload(payload).fetch();
  return response.data?.items || [];
}

export async function updateAccount(bookId: string, account: bkper.Account): Promise<bkper.Account> {
  var payload = account;
  var response = await new HttpBooksApiV5Request(`${bookId}/accounts`).setMethod('PUT').setPayload(payload).fetch();
  return response.data;
}

export async function deleteAccount(bookId: string, account: bkper.Account): Promise<bkper.Account> {
  var response = await new HttpBooksApiV5Request(`${bookId}/accounts/${account.id}`).setMethod('DELETE').fetch();
  return response.data;
}

export async function getAccount(bookId: string, idOrName: string): Promise<bkper.Account> {
  let response = await new HttpBooksApiV5Request(`${bookId}/accounts/${encodeURIComponent(idOrName)}`).setMethod('GET').fetch();
  return response.data;
}

export async function getAccounts(bookId: string): Promise<bkper.Account[]> {
  let response = await new HttpBooksApiV5Request(`${bookId}/accounts`).setMethod('GET').fetch();
  return response?.data?.items || [];
}
