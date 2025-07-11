import { HttpBooksApiV5Request } from "./http-api-request.js";

export async function loadBooks(query?: string): Promise<bkper.Book[]> {
  let request = new HttpBooksApiV5Request('');
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

export async function loadBook(bookId: string, loadAccounts?: boolean, loadGroups?: boolean): Promise<bkper.Book> {
  if (bookId == null) {
    throw new Error("Book id null!");
  }
  loadAccounts = loadAccounts || false;
  loadGroups = loadGroups || false;
  let response = await new HttpBooksApiV5Request(bookId).addParam('loadAccounts', loadAccounts).addParam('loadGroups', loadGroups).fetch();
  return response.data;
}

export async function createBook(book: bkper.Book): Promise<bkper.Book> {
  let response = await new HttpBooksApiV5Request('').setMethod('POST').setPayload(book).fetch();
  return response.data;
}

export async function updateBook(bookId: string, book: bkper.Book): Promise<bkper.Book> {
  var response = await new HttpBooksApiV5Request(`${bookId}`).setMethod('PUT').setPayload(book).fetch();
  return response.data;
}

export async function audit(bookId: string): Promise<void> {
  new HttpBooksApiV5Request(`${bookId}/audit`).setMethod('PATCH').fetch();
}

export async function getApps(bookId: string): Promise<bkper.App[]> {
  let response = await new HttpBooksApiV5Request(`${bookId}/apps`).setMethod('GET').fetch();
  return response?.data?.items || [];
}

export async function copyBook(bookId: string, name: string, copyTransactions?: boolean, fromDate?: number): Promise<bkper.Book> {
  const request = new HttpBooksApiV5Request(`${bookId}/copy`).setMethod('POST').addParam('name', name);
  if (copyTransactions) {
    request.addParam('copyTransactions', copyTransactions);
    if (fromDate) {
      request.addParam('fromDate', fromDate);
    }
  }
  const response = await request.fetch();
  return response.data;
}
