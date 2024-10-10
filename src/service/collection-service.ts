import { HttpApiV5Request } from "./http-api-request.js";

export async function loadCollections(): Promise<bkper.Collection[]> {
  let response = await new HttpApiV5Request('collections').fetch();
  return response?.data?.items || [];
}

export async function createCollection(payload: bkper.Collection): Promise<bkper.Collection> {
  let response = await new HttpApiV5Request('collections').setMethod('POST').setPayload(payload).fetch();
  return response.data;
}
