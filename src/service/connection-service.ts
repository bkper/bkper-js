import { HttpApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function getConnection(id: string, config: Config): Promise<bkper.Connection> {
  const res = await new HttpApiV5Request(`user/connections/${id}`, config)
    .setMethod('GET')
    .fetch()
  return res.data;

}

export async function listConnections(config: Config): Promise<bkper.Connection[]> {
  const res = await new HttpApiV5Request(`user/connections`, config)
    .setMethod('GET')
    .fetch()
  return res?.data?.items || [];
}

export async function createConnection(connection: bkper.Connection, config: Config): Promise<bkper.Connection> {
  const res = await new HttpApiV5Request(`user/connections`, config)
    .setPayload(connection)
    .setMethod('POST')
    .fetch()
  return res.data;
}

export async function updateConnection(connection: bkper.Connection, config: Config): Promise<bkper.Connection> {
  const res = await new HttpApiV5Request(`user/connections`, config)
    .setPayload(connection)
    .setMethod('PUT')
    .fetch()
  return res.data;
}

export async function deleteConnection(id: string, config: Config): Promise<bkper.Connection> {
  const res = await new HttpApiV5Request(`user/connections/${id}`, config)
    .setMethod('DELETE')
    .fetch()
  return res.data;
}

export async function listIntegrations(connectionId: string, config: Config): Promise<bkper.Integration[]> {
  const res = await new HttpApiV5Request(`user/connections/${connectionId}/integrations`, config)
  .setMethod('GET')
  .fetch()
  return res?.data?.items || [];
}