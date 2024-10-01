import { Book } from "./Book.js"
import { Transaction } from "./Transaction.js"
import { Account } from "./Account.js"
import * as TransactionService from '../service/transaction-service.js';

/**
 * A list associated with a transaction query.
 */
export class TransactionList {

  private book: Book;
  private wrapped: bkper.TransactionList;

  constructor(book: Book, transactionList: bkper.TransactionList) {
    this.book = book;
    this.wrapped = transactionList;
  }

  /**
   * @returns The cursor associated with the query for pagination.
   */
  public getCursor(): string | undefined {
    return this.wrapped.cursor;
  }

  /**
   * Retrieves the account associated with the query, when filtering by account.
   */
  public async getAccount(): Promise<Account | undefined> {
    if (!this.wrapped.account) {
      return undefined;
    }
    return await this.book.getAccount(this.wrapped.account);
  }

  public hasAny(): boolean {
    return (this.wrapped.items?.length && this.wrapped.items.length > 0) || false;
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
    return this.wrapped.items?.length || 0;
  }

  /**
   * Get the transactions in the list.
   * 
   * @returns An array of Transaction objects.
   */
  public getItems(): Transaction[] {
    let transactions: Transaction[] = [];
    for (let transaction of this.wrapped.items ?? []) {
      transactions.push(new Transaction(this.book, transaction));
    }
    return transactions;
  }

}