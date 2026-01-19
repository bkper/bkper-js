import { HttpApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function getUser(config: Config): Promise<bkper.User> {
    const res = await new HttpApiV5Request(`user`, config).setMethod('GET').fetch()
    return res.data;
}

export async function getBilling(config: Config): Promise<bkper.Billing> {
    const res = await new HttpApiV5Request(`user/billing`, config).setMethod('GET').fetch();
    return res.data;
}

export async function getBillingPortalUrl(returnUrl: string, config: Config): Promise<bkper.Url> {
    const res = await new HttpApiV5Request(`user/billing/portal`, config).addParam('returnUrl', returnUrl).fetch();
    return res.data;
}
