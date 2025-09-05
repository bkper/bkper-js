import { HttpBooksApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function createGroup(bookId: string, group: bkper.Group, config: Config): Promise<bkper.Group> {
  var response = await new HttpBooksApiV5Request(`${bookId}/groups`, config).setMethod('POST').setPayload(group).fetch();
  return response.data;
}

export async function createGroups(bookId: string, payload: bkper.GroupList, config: Config): Promise<bkper.Group[]> {
  const response = await new HttpBooksApiV5Request(`${bookId}/groups/batch`, config).setMethod('POST').setPayload(payload).fetch();
  return response.data?.items || [];
}

export async function updateGroup(bookId: string, group: bkper.Group, config: Config): Promise<bkper.Group> {
  var response = await new HttpBooksApiV5Request(`${bookId}/groups`, config).setMethod('PUT').setPayload(group).fetch();
  return response.data;
}

export async function deleteGroup(bookId: string, group: bkper.Group, config: Config): Promise<bkper.Group> {
  var response = await new HttpBooksApiV5Request(`${bookId}/groups/${group.id}`, config).setMethod('DELETE').fetch();
  return response.data;
}


export async function getGroupsByAccountId(bookId: string, accountId: string, config: Config): Promise<bkper.Group[]> {
  var response = await new HttpBooksApiV5Request(`${bookId}/accounts/${accountId}/groups`, config).setMethod('GET').fetch();
  return response?.data?.items || [];
}

export async function getGroups(bookId: string, config: Config): Promise<bkper.Group[]> {
  var response = await new HttpBooksApiV5Request(`${bookId}/groups`, config).setMethod('GET').fetch();
  var groupsPlain = response.data;
  if (!groupsPlain?.items) {
    return [];
  }
  return groupsPlain.items;
}

export async function getGroup(bookId: string, idOrName: string, config: Config): Promise<bkper.Group> {
    var response = await new HttpBooksApiV5Request(`${bookId}/groups/${encodeURIComponent(idOrName)}`, config).setMethod('GET').fetch();
    return response.data;
}

export async function getAccounts(bookId: string, idOrName: string, config: Config): Promise<bkper.Account[]> {
  if (!idOrName) {
    return [];
  }
  var response = await new HttpBooksApiV5Request(`${bookId}/groups/${encodeURIComponent(idOrName)}/accounts`, config).setMethod('GET').fetch();
  var accountsPlain = response.data;
  if (!accountsPlain?.items) {
    return [];
  }
  return accountsPlain.items;
}