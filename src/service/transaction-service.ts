import { HttpBooksApiV5Request } from "./http-api-request.js";

export async function createTransaction(bookId: string, transaction: bkper.Transaction): Promise<bkper.TransactionOperation> {
  var response = await new HttpBooksApiV5Request(`${bookId}/transactions`).setMethod('POST').setPayload(transaction).fetch();
  return response.data;
}

export async function postTransactionsBatch(bookId: string, transactions: bkper.Transaction[]): Promise<void> {
  const payload: bkper.TransactionList = { items: transactions };
  await new HttpBooksApiV5Request(`${bookId}/transactions/post/batch`).setMethod('PATCH').setPayload(payload).fetch();
}

export async function createTransactionsBatch(bookId: string, transactions: bkper.Transaction[]): Promise<bkper.Transaction[]> {
  let transactionList: bkper.TransactionList = { items: transactions };
  const payload = transactionList;
  const response = await new HttpBooksApiV5Request(`${bookId}/transactions/batch`).setMethod('POST').setPayload(payload).fetch();
  transactionList = await response.data;
  return transactionList != null && transactionList.items != null ? transactionList.items : [];
}

export async function updateTransactionsBatch(bookId: string, transactions: bkper.Transaction[], updateChecked?: boolean): Promise<bkper.Transaction[]> {
  let transactionList: bkper.TransactionList = { items: transactions };
  const payload = transactionList;
  const response = await new HttpBooksApiV5Request(`${bookId}/transactions/batch`).setMethod('PUT').setPayload(payload).addParam('updateChecked', updateChecked).fetch();
  transactionList = await response.data;
  return transactionList != null && transactionList.items != null ? transactionList.items : [];
}

export async function checkTransactionsBatch(bookId: string, transactions: bkper.Transaction[]): Promise<void> {
  const payload: bkper.TransactionList = { items: transactions };
  await new HttpBooksApiV5Request(`${bookId}/transactions/check/batch`).setMethod('PATCH').setPayload(payload).fetch();
}

export async function uncheckTransactionsBatch(bookId: string, transactions: bkper.Transaction[]): Promise<void> {
  const payload: bkper.TransactionList = { items: transactions };
  await new HttpBooksApiV5Request(`${bookId}/transactions/uncheck/batch`).setMethod('PATCH').setPayload(payload).fetch();
}

export async function trashTransactionsBatch(bookId: string, transactions: bkper.Transaction[], trashChecked?: boolean): Promise<void> {
  let transactionList: bkper.TransactionList = { items: transactions };
  const payload = transactionList;
  const response = await new HttpBooksApiV5Request(`${bookId}/transactions/trash/batch`).setMethod('PATCH').setPayload(payload).addParam('trashChecked', trashChecked).fetch();
  transactionList = await response.data;
}

export async function untrashTransactionsBatch(bookId: string, transactions: bkper.Transaction[]): Promise<void> {
  let transactionList: bkper.TransactionList = { items: transactions };
  const payload = transactionList;
  const response = await new HttpBooksApiV5Request(`${bookId}/transactions/untrash/batch`).setMethod('PATCH').setPayload(payload).fetch();
  transactionList = await response.data;
}

export async function updateTransaction(bookId: string, transaction: bkper.Transaction): Promise<bkper.TransactionOperation> {
  var response = await new HttpBooksApiV5Request(`${bookId}/transactions`).setMethod('PUT').setPayload(transaction).fetch();
  return response.data;
}

export async function postTransaction(bookId: string, transaction: bkper.Transaction): Promise<bkper.TransactionOperation> {
  var response = await new HttpBooksApiV5Request(`${bookId}/transactions/post`).setMethod('PATCH').setPayload(transaction).fetch();
  return response.data;
}

export async function checkTransaction(bookId: string, transaction: bkper.Transaction): Promise<bkper.TransactionOperation> {
  var response = await new HttpBooksApiV5Request(`${bookId}/transactions/check`).setMethod('PATCH').setPayload(transaction).fetch();
  return response.data;
}

export async function uncheckTransaction(bookId: string, transaction: bkper.Transaction): Promise<bkper.TransactionOperation> {
  var response = await new HttpBooksApiV5Request(`${bookId}/transactions/uncheck`).setMethod('PATCH').setPayload(transaction).fetch();
  return response.data;
}

export async function trashTransaction(bookId: string, transaction: bkper.Transaction): Promise<bkper.TransactionOperation> {
  var response = await new HttpBooksApiV5Request(`${bookId}/transactions/trash`).setMethod('PATCH').setPayload(transaction).fetch();
  return response.data;
}

export async function restoreTransaction(bookId: string, transaction: bkper.Transaction): Promise<bkper.TransactionOperation> {
  var response = await new HttpBooksApiV5Request(`${bookId}/transactions/restore`).setMethod('PATCH').setPayload(transaction).fetch();
  return response.data;
}

export async function getTransaction(bookId: string, id: string): Promise<bkper.Transaction> {
  var response = await new HttpBooksApiV5Request(`${bookId}/transactions/${id}`).setMethod('GET').fetch();
  return response.data;
}

export async function listTransactions(bookId: string, query?: string, limit?: number, cursor?: string): Promise<bkper.TransactionList> {
  if (!query) {
    query = "";
  }
  if (!limit) {
    limit = 100;
  }
  var request = new HttpBooksApiV5Request(`${bookId}/transactions`);
  request.addParam('query', query);
  request.addParam('limit', limit);
  if (cursor != null) {
    request.setHeader('cursor', cursor);
  }

  var response = await request.fetch();
  return response.data;
}
