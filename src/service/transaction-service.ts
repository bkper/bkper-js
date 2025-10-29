import { HttpBooksApiV5Request } from "./http-api-request.js";
import { Config } from '../model/Config.js';

export async function createTransaction(bookId: string, transaction: bkper.Transaction, config: Config): Promise<bkper.TransactionOperation> {
    var response = await new HttpBooksApiV5Request(`${bookId}/transactions`, config).setMethod('POST').setPayload(transaction).fetch();
    return response.data;
}

export async function postTransactionsBatch(bookId: string, transactions: bkper.Transaction[], config: Config): Promise<void> {
    const payload: bkper.TransactionList = { items: transactions };
    await new HttpBooksApiV5Request(`${bookId}/transactions/post/batch`, config).setMethod('PATCH').setPayload(payload).fetch();
}

export async function createTransactionsBatch(bookId: string, transactions: bkper.Transaction[], config: Config): Promise<bkper.Transaction[]> {
    let transactionList: bkper.TransactionList = { items: transactions };
    const payload = transactionList;
    const response = await new HttpBooksApiV5Request(`${bookId}/transactions/batch`, config).setMethod('POST').setPayload(payload).fetch();
    transactionList = await response.data;
    return transactionList != null && transactionList.items != null ? transactionList.items : [];
}

export async function updateTransactionsBatch(bookId: string, transactions: bkper.Transaction[], updateChecked: boolean | undefined, config: Config): Promise<bkper.Transaction[]> {
    let transactionList: bkper.TransactionList = { items: transactions };
    const payload = transactionList;
    const response = await new HttpBooksApiV5Request(`${bookId}/transactions/batch`, config).setMethod('PUT').setPayload(payload).addParam('updateChecked', updateChecked).fetch();
    transactionList = await response.data;
    return transactionList != null && transactionList.items != null ? transactionList.items : [];
}

export async function checkTransactionsBatch(bookId: string, transactions: bkper.Transaction[], config: Config): Promise<void> {
    const payload: bkper.TransactionList = { items: transactions };
    await new HttpBooksApiV5Request(`${bookId}/transactions/check/batch`, config).setMethod('PATCH').setPayload(payload).fetch();
}

export async function uncheckTransactionsBatch(bookId: string, transactions: bkper.Transaction[], config: Config): Promise<void> {
    const payload: bkper.TransactionList = { items: transactions };
    await new HttpBooksApiV5Request(`${bookId}/transactions/uncheck/batch`, config).setMethod('PATCH').setPayload(payload).fetch();
}

export async function trashTransactionsBatch(bookId: string, transactions: bkper.Transaction[], trashChecked: boolean | undefined, config: Config): Promise<void> {
    let transactionList: bkper.TransactionList = { items: transactions };
    const payload = transactionList;
    const response = await new HttpBooksApiV5Request(`${bookId}/transactions/trash/batch`, config).setMethod('PATCH').setPayload(payload).addParam('trashChecked', trashChecked).fetch();
    transactionList = await response.data;
}

export async function untrashTransactionsBatch(bookId: string, transactions: bkper.Transaction[], config: Config): Promise<void> {
    let transactionList: bkper.TransactionList = { items: transactions };
    const payload = transactionList;
    const response = await new HttpBooksApiV5Request(`${bookId}/transactions/untrash/batch`, config).setMethod('PATCH').setPayload(payload).fetch();
    transactionList = await response.data;
}

export async function updateTransaction(bookId: string, transaction: bkper.Transaction, config: Config): Promise<bkper.TransactionOperation> {
    var response = await new HttpBooksApiV5Request(`${bookId}/transactions`, config).setMethod('PUT').setPayload(transaction).fetch();
    return response.data;
}

export async function postTransaction(bookId: string, transaction: bkper.Transaction, config: Config): Promise<bkper.TransactionOperation> {
    var response = await new HttpBooksApiV5Request(`${bookId}/transactions/post`, config).setMethod('PATCH').setPayload(transaction).fetch();
    return response.data;
}

export async function checkTransaction(bookId: string, transaction: bkper.Transaction, config: Config): Promise<bkper.TransactionOperation> {
    var response = await new HttpBooksApiV5Request(`${bookId}/transactions/check`, config).setMethod('PATCH').setPayload(transaction).fetch();
    return response.data;
}

export async function uncheckTransaction(bookId: string, transaction: bkper.Transaction, config: Config): Promise<bkper.TransactionOperation> {
    var response = await new HttpBooksApiV5Request(`${bookId}/transactions/uncheck`, config).setMethod('PATCH').setPayload(transaction).fetch();
    return response.data;
}

export async function trashTransaction(bookId: string, transaction: bkper.Transaction, config: Config): Promise<bkper.TransactionOperation> {
    var response = await new HttpBooksApiV5Request(`${bookId}/transactions/trash`, config).setMethod('PATCH').setPayload(transaction).fetch();
    return response.data;
}

export async function restoreTransaction(bookId: string, transaction: bkper.Transaction, config: Config): Promise<bkper.TransactionOperation> {
    var response = await new HttpBooksApiV5Request(`${bookId}/transactions/restore`, config).setMethod('PATCH').setPayload(transaction).fetch();
    return response.data;
}

export async function getTransaction(bookId: string, id: string, config: Config): Promise<bkper.Transaction> {
    var response = await new HttpBooksApiV5Request(`${bookId}/transactions/${id}`, config).setMethod('GET').fetch();
    return response.data;
}

export async function listTransactions(bookId: string, query: string | undefined, limit: number | undefined, cursor: string | undefined, config: Config): Promise<bkper.TransactionList> {
    if (!query) {
        query = "";
    }
    if (!limit) {
        limit = 100;
    }
    var request = new HttpBooksApiV5Request(`${bookId}/transactions`, config);
    request.addParam('query', query);
    request.addParam('limit', limit);
    if (cursor != null) {
        request.setHeader('cursor', cursor);
    }

    var response = await request.fetch();
    return response.data;
}

export async function countTransactions(bookId: string, query: string | undefined, config: Config): Promise<bkper.Count> {
    const request = new HttpBooksApiV5Request(`${bookId}/transactions/count`, config).setMethod('GET').addParam('query', query);
    const response = await request.fetch();
    return response.data;
}
