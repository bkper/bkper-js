import { HttpBooksApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function listIntegrations(bookId: string, config: Config): Promise<bkper.Integration[]> {
    const res = await new HttpBooksApiV5Request(`${bookId}/integrations`, config)
        .setMethod('GET')
        .fetch()
    return res?.data?.items || [];
}

export async function createIntegration(bookId: string, integration: bkper.Integration, config: Config): Promise<bkper.Integration> {
    const res = await new HttpBooksApiV5Request(`${bookId}/integrations`, config)
        .setPayload(integration)
        .setMethod('POST')
        .fetch()
    return res.data;
}

export async function updateIntegration(bookId: string, integration: bkper.Integration, config: Config): Promise<bkper.Integration> {
    const res = await new HttpBooksApiV5Request(`${bookId}/integrations`, config)
        .setPayload(integration)
        .setMethod('PUT')
        .fetch()
    return res.data;
}

export async function deleteIntegration(bookId: string, id: string, config: Config): Promise<bkper.Integration> {
    const res = await new HttpBooksApiV5Request(`${bookId}/integrations/${id}`, config).setMethod('DELETE').fetch();
    return res.data;
}  
