import { HttpBooksApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function loadBooks(query: string | undefined, config: Config): Promise<bkper.Book[]> {
  let request = new HttpBooksApiV5Request('', config);
  if (query) {
    request.addParam('query', query);
  }
  let response = await request.fetch();
  if (response.data == null) {
    return [];
  }
  let bookListPlain: bkper.BookList = response.data;
  let booksJson = bookListPlain.items;
  if (booksJson == null) {
    return [];
  }
  return booksJson;
}

export async function loadBook(bookId: string, loadAccounts: boolean | undefined, loadGroups: boolean | undefined, config: Config): Promise<bkper.Book> {
  if (bookId == null) {
    throw new Error("Book id null!");
  }
  loadAccounts = loadAccounts || false;
  loadGroups = loadGroups || false;
  let response = await new HttpBooksApiV5Request(bookId, config).addParam('loadAccounts', loadAccounts).addParam('loadGroups', loadGroups).fetch();
  return response.data;
}

export async function createBook(book: bkper.Book, config: Config): Promise<bkper.Book> {
  let response = await new HttpBooksApiV5Request('', config).setMethod('POST').setPayload(book).fetch();
  return response.data;
}

export async function updateBook(bookId: string, book: bkper.Book, config: Config): Promise<bkper.Book> {
  var response = await new HttpBooksApiV5Request(`${bookId}`, config).setMethod('PUT').setPayload(book).fetch();
  return response.data;
}

export async function audit(bookId: string, config: Config): Promise<void> {
  new HttpBooksApiV5Request(`${bookId}/audit`, config).setMethod('PATCH').fetch();
}

export async function getApps(bookId: string, config: Config): Promise<bkper.App[]> {
  let response = await new HttpBooksApiV5Request(`${bookId}/apps`, config).setMethod('GET').fetch();
  return response?.data?.items || [];
}

export async function copyBook(bookId: string, name: string, copyTransactions: boolean | undefined, fromDate: number | undefined, config: Config): Promise<bkper.Book> {
  const request = new HttpBooksApiV5Request(`${bookId}/copy`, config).setMethod('POST').addParam('name', name);
  if (copyTransactions) {
    request.addParam('copyTransactions', copyTransactions);
    if (fromDate) {
      request.addParam('fromDate', fromDate);
    }
  }
  const response = await request.fetch();
  return response.data;
}

export async function deleteBook(bookId: string, config: Config): Promise<bkper.Book> {
  const response = await new HttpBooksApiV5Request(`${bookId}`, config).setMethod('DELETE').fetch();
  return response.data;
}
