import { HttpApiRequest } from "./http-api-request.js";

export async function getApps(): Promise<bkper.App[]> {
  let response = await new HttpApiRequest(`v5/apps`).setMethod('GET').fetch();
  if (response.data == null) {
    return [];
  }
  let appListPlain: bkper.AppList = response.data;
  let appsJson = appListPlain.items;
  if (appsJson == null) {
    return [];
  }
  return appsJson;
}

export async function getConversations(): Promise<bkper.Conversation[]> {
  const response = await new HttpApiRequest(`v5/apps/conversations`).setMethod('GET').fetch();
  return response.data?.items || [];
}

export async function createApp(app: bkper.App): Promise<bkper.App> {
  var response = await new HttpApiRequest(`v5/apps`).setMethod('POST').setPayload(app).fetch();
  return response.data;
}

export async function updateApp(app: bkper.App): Promise<bkper.App> {
  var response = await new HttpApiRequest(`v5/apps`).setMethod('PUT').setPayload(app).fetch();
  return response.data;
}

export async function patchApp(app: bkper.App): Promise<bkper.App> {
  var response = await new HttpApiRequest(`v5/apps`).setMethod('PATCH').setPayload(app).fetch();
  return response.data;
}
