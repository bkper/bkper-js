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

export async function getBillingCounts(config: Config): Promise<bkper.Counts> {
    const res = await new HttpApiV5Request(`user/billing/counts`, config).setMethod('GET').fetch();
    return res.data;
}

export async function getBillingPortalUrl(returnUrl: string, config: Config): Promise<bkper.Url> {
    const res = await new HttpApiV5Request(`user/billing/portal`, config).addParam('returnUrl', returnUrl).fetch();
    return res.data;
}

export async function getBillingCheckoutUrl(plan: string, successUrl: string | undefined, cancelUrl: string | undefined, config: Config): Promise<bkper.Url> {
    const request = new HttpApiV5Request(`user/billing/checkout`, config).addParam('plan', plan);
    if (successUrl) {
        request.addParam('successUrl', successUrl);
    }
    if (cancelUrl) {
        request.addParam('cancelUrl', cancelUrl);
    }
    const res = await request.fetch();
    return res.data;
}
