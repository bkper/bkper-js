import { HttpApiRequest } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function getApps(config: Config): Promise<bkper.App[]> {
  let response = await new HttpApiRequest(`v5/apps`, config).setMethod('GET').fetch();
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

export async function createApp(app: bkper.App, config: Config): Promise<bkper.App> {
  var response = await new HttpApiRequest(`v5/apps`, config).setMethod('POST').setPayload(app).fetch();
  return response.data;
}

export async function updateApp(app: bkper.App, config: Config): Promise<bkper.App> {
  var response = await new HttpApiRequest(`v5/apps`, config).setMethod('PUT').setPayload(app).fetch();
  return response.data;
}

export async function patchApp(app: bkper.App, config: Config): Promise<bkper.App> {
  var response = await new HttpApiRequest(`v5/apps`, config).setMethod('PATCH').setPayload(app).fetch();
  return response.data;
}
