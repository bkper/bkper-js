import { Book } from "./Book.js"
import { Transaction } from "./Transaction.js"
import { Account } from "./Account.js"
import * as TransactionService from '../service/transaction-service.js';

/**
 * A list associated with a transaction query.
 */
export class TransactionList {

  private payload: bkper.TransactionList;

  /** @internal */
  private book: Book;

  constructor(book: Book, payload: bkper.TransactionList) {
    this.book = book;
    this.payload = payload;
  }

  /**
   * @returns The cursor associated with the query for pagination.
   */
  public getCursor(): string | undefined {
    return this.payload.cursor;
  }

  /**
   * Retrieves the account associated with the query, when filtering by account.
   */
  public async getAccount(): Promise<Account | undefined> {
    if (!this.payload.account) {
      return undefined;
    }
    return await this.book.getAccount(this.payload.account);
  }

  /**
   * @returns The first Transaction in the list.
   */
  public getFirst(): Transaction | undefined {
    const transactions = this.getItems();
    return transactions.length > 0 ? transactions[0] : undefined;
  }

  /**
   * 
   * Get the total number of transactions in the list.
   * 
   * @returns The total number of transactions.
   */
  public size(): number {
    return this.payload.items?.length || 0;
  }

  /**
   * Get the transactions in the list.
   * 
   * @returns An array of Transaction objects.
   */
  public getItems(): Transaction[] {
    let transactions: Transaction[] = [];
    for (let transaction of this.payload.items ?? []) {
      transactions.push(new Transaction(this.book, transaction));
    }
    return transactions;
  }

}