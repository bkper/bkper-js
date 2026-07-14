import { HttpBooksApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function createFile(bookId: string, file: bkper.File, config: Config): Promise<bkper.File> {
    var response = await new HttpBooksApiV5Request(`${bookId}/files`, config).setMethod('POST').setPayload(file).fetch();
    return response.data;
}

export async function getFile(bookId: string, id: string, config: Config): Promise<bkper.File> {
    var response = await new HttpBooksApiV5Request(`${bookId}/files/${id}`, config).setMethod('GET').fetch();
    return response.data;
}

export async function listFiles(bookId: string, limit: number | undefined, cursor: string | undefined, config: Config): Promise<bkper.FileList> {
    if (!limit) {
        limit = 100;
    }
    const request = new HttpBooksApiV5Request(`${bookId}/files`, config);
    request.addParam('limit', limit);
    if (cursor != null) {
        request.setHeader('cursor', cursor);
    }

    const response = await request.fetch();
    return response.data;
}

export async function updateFile(bookId: string, file: bkper.File, config: Config): Promise<bkper.File> {
    let response = await new HttpBooksApiV5Request(`${bookId}/files`, config).setMethod('PUT').setPayload(file).fetch();
    return response.data;
}

export async function deleteFile(bookId: string, file: bkper.File, config: Config): Promise<bkper.File> {
    const response = await new HttpBooksApiV5Request(`${bookId}/files/${file.id}`, config).setMethod('DELETE').fetch();
    return response.data;
}
