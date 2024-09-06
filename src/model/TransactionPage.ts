import { Book } from "./Book.js"
import { Transaction } from "./Transaction.js"
import { Account } from "./Account.js"
import * as TransactionService from '../service/transaction-service.js';


export class TransactionPage {

  private account?: Account
  private transactions: Transaction[] = []
  private cursor?: string
  private index?: number
  private reachEnd?: boolean

  async init(book: Book, query?: string, lastCursor?: string): Promise<TransactionPage> {

    var transactionList = await TransactionService.searchTransactions(book.getId(), query, 1000, lastCursor);

    if (!transactionList.items) {
      transactionList.items = [];
    }

    this.transactions = transactionList.items.map(tx => new Transaction(book, tx));
    this.cursor = transactionList.cursor;
    if (transactionList.account) {
      this.account = await book.getAccount(transactionList.account)
    }
    this.index = 0;
    if (this.transactions == null || this.transactions.length == 0 || this.cursor == null || this.cursor == "") {
      this.reachEnd = true;
    } else {
      this.reachEnd = false;
    }

    return this;
  }

  public getCursor(): string | undefined {
    return this.cursor;
  }

  public hasNext(): boolean {
    return (this.index != null && this.index < this.transactions.length) || false;
  }

  public hasReachEnd(): boolean {
    return this.reachEnd || false;
  }

  public getIndex(): number {
    if (this.index != null && this.index >= this.transactions.length) {
      return 0;
    } else {
      return this.index || 0;
    }

  }

  public setIndex(index: number) {
    this.index = index;
  }

  public getAccount(): Account | undefined {
    return this.account;
  }

  public next(): Transaction | undefined {
    if (this.index != null && this.index < this.transactions.length) {
      var transaction = this.transactions[this.index];
      this.index++;
      return transaction;
    } else {
      return undefined;
    }
  }
}