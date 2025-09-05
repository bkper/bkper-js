import { HttpBooksApiV5Request } from './http-api-request.js';
import { Config } from '../model/Config.js';

export async function listCollaborators(bookId: string, config: Config): Promise<bkper.Collaborator[]> {
  const response = await new HttpBooksApiV5Request(`${bookId}/collaborators`, config).setMethod('GET').fetch();
  return response?.data?.items || [];
}

export async function addOrUpdateCollaborator(bookId: string, collaborator: bkper.Collaborator, message: string | undefined, config: Config): Promise<bkper.Collaborator> {
  let request = new HttpBooksApiV5Request(`${bookId}/collaborators`, config).setMethod('POST').setPayload(collaborator);
  if (message) {
    request = request.addParam('message', message);
  }
  const response = await request.fetch();
  return response.data;
}

export async function removeCollaborator(bookId: string, email: string, config: Config): Promise<bkper.Collaborator> {
  const response = await new HttpBooksApiV5Request(`${bookId}/collaborators/${email}`, config).setMethod('DELETE').fetch();
  return response.data;
}
