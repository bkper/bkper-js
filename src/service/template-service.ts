import { HttpApiRequest } from "./http-api-request.js";

export async function getTemplates(): Promise<bkper.Template[]> {
  let response = await new HttpApiRequest(`v5/templates`).setMethod('GET').fetch();
  if (response.data == null) {
    return [];
  }
  let templateListPlain: bkper.TemplateList = response.data;
  let templatesJson = templateListPlain.items;
  if (templatesJson == null) {
    return [];
  }
  return templatesJson;
}
