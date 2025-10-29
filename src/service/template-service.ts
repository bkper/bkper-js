import { HttpApiRequest } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function getTemplates(config: Config): Promise<bkper.Template[]> {
    let response = await new HttpApiRequest(`v5/templates`, config).setMethod('GET').fetch();
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
