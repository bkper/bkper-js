import { Book } from "./Book.js"
import { Transaction } from "./Transaction.js"
import { Account } from "./Account.js"
import * as TransactionService from '../service/transaction-service.js';


export class TransactionPage {

  private book: Book;
  private wrapped: bkper.TransactionList;

  constructor(book: Book, transactionList: bkper.TransactionList) {
    this.book = book;
    this.wrapped = transactionList;
  }

  public getCursor(): string | undefined {
    return this.wrapped.cursor;
  }

  public async getAccount(): Promise<Account | undefined> {
    if (!this.wrapped.account) {
      return undefined;
    }
    return await this.book.getAccount(this.wrapped.account);
  }

  public getTransactions(): Transaction[] {
    let transactions: Transaction[] = [];
    for (let transaction of this.wrapped.items ?? []) {
      transactions.push(new Transaction(this.book, transaction));
    }
    return transactions;
  }

}