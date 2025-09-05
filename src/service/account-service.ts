import { HttpBooksApiV5Request } from './http-api-request.js';
import { Config } from '../model/Config.js';

export async function createAccount(bookId: string, account: bkper.Account, config: Config): Promise<bkper.Account> {
  var response = await new HttpBooksApiV5Request(`${bookId}/accounts`, config).setMethod('POST').setPayload(account).fetch();
  return response.data;
}

export async function createAccounts(bookId: string, payload: bkper.AccountList, config: Config): Promise<bkper.Account[]> {
  const response = await new HttpBooksApiV5Request(`${bookId}/accounts/batch`, config).setMethod('POST').setPayload(payload).fetch();
  return response.data?.items || [];
}

export async function updateAccount(bookId: string, account: bkper.Account, config: Config): Promise<bkper.Account> {
  var payload = account;
  var response = await new HttpBooksApiV5Request(`${bookId}/accounts`, config).setMethod('PUT').setPayload(payload).fetch();
  return response.data;
}

export async function deleteAccount(bookId: string, account: bkper.Account, config: Config): Promise<bkper.Account> {
  var response = await new HttpBooksApiV5Request(`${bookId}/accounts/${account.id}`, config).setMethod('DELETE').fetch();
  return response.data;
}

export async function getAccount(bookId: string, idOrName: string, config: Config): Promise<bkper.Account> {
  let response = await new HttpBooksApiV5Request(`${bookId}/accounts/${encodeURIComponent(idOrName)}`, config).setMethod('GET').fetch();
  return response.data;
}

export async function getAccounts(bookId: string, config: Config): Promise<bkper.Account[]> {
  let response = await new HttpBooksApiV5Request(`${bookId}/accounts`, config).setMethod('GET').fetch();
  return response?.data?.items || [];
}
