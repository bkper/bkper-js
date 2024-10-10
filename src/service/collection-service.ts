import { HttpApiV5Request } from "./http-api-request.js";

export async function loadCollections(): Promise<bkper.Collection[]> {
  let response = await new HttpApiV5Request('collections').fetch();
  return response?.data?.items || [];
}
