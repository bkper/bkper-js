import { HttpBooksApiV5Request } from './http-api-request.js';

export async function listCollaborators(bookId: string): Promise<bkper.Collaborator[]> {
  const response = await new HttpBooksApiV5Request(`${bookId}/collaborators`).setMethod('GET').fetch();
  return response.data || [];
}

export async function addOrUpdateCollaborator(bookId: string, collaborator: bkper.Collaborator, message?: string): Promise<bkper.Collaborator> {
  let request = new HttpBooksApiV5Request(`${bookId}/collaborators`).setMethod('POST').setPayload(collaborator);
  if (message) {
    request = request.addParam('message', message);
  }
  const response = await request.fetch();
  return response.data;
}

export async function removeCollaborator(bookId: string, email: string): Promise<bkper.Collaborator> {
  const response = await new HttpBooksApiV5Request(`${bookId}/collaborators/${email}`).setMethod('DELETE').fetch();
  return response.data;
}
