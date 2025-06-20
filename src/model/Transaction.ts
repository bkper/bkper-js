import { File } from "./File.js";
import { Book } from "./Book.js";
import { Account } from "./Account.js";
import * as TransactionService from '../service/transaction-service.js';
import * as Utils from '../utils.js';
import { Amount } from './Amount.js';


/**
 * 
 * This class defines a Transaction between [credit and debit](http://en.wikipedia.org/wiki/Debits_and_credits) [[Accounts]].
 *
 * A Transaction is the main entity on the [Double Entry](http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) [Bookkeeping](http://en.wikipedia.org/wiki/Bookkeeping) system.
 * 
 * @public
 */
export class Transaction {
  
  public payload: bkper.Transaction
  
  /** @internal */
  private book: Book;

  constructor(book: Book, payload?: bkper.Transaction) {
    this.book = book;
    this.payload = payload || {
      createdAt: `${Date.now()}`
    };
  }

  /**
   * @returns An immutable copy of the json payload
   */
  public json(): bkper.Transaction {
    return { ...this.payload };
  }

  /**
   * @returns The book of the Transaction.
   */
  public getBook(): Book {
    return this.book;
  }

  /**
   * @returns The id of the Transaction.
   */
  public getId(): string | undefined{
    return this.payload.id;
  }

  /**
   * @returns The id of the agent that created this transaction
   */
  public getAgentId(): string | undefined {
    return this.payload.agentId;
  }

  /**
   * @returns The name of the agent that created this transaction
   */
  public getAgentName(): string | undefined {
    return this.payload.agentName;
  }

  /**
   * @returns The logo of the agent that created this transaction
   */
  public getAgentLogoUrl(): string | undefined {
    return this.payload.agentLogo;
  }

  /**
   * @returns The logo of the agent that created this transaction in dark mode
   */
  public getAgentLogoUrlDark(): string | undefined {
    return this.payload.agentLogoDark;
  }
  
  /**
   * Remote ids are used to avoid duplication.
   * 
   * @returns The remote ids of the Transaction.
   */
  public getRemoteIds(): string[] {
    return this.payload.remoteIds || [];
  }

  /**
   * Add a remote id to the Transaction.
   * 
   * @param remoteId - The remote id to add.
   * 
   * @returns This Transaction, for chainning.
   */
  public addRemoteId(remoteId: string): Transaction {
    if (this.payload.remoteIds == null) {
      this.payload.remoteIds = [];
    }
    if (remoteId) {
      this.payload.remoteIds.push(remoteId);
    }
    return this;
  }

  /**
   * @returns True if transaction was already posted to the accounts. False if is still a Draft.
   */
  public isPosted(): boolean | undefined {
    return this.payload.posted;
  }

  /**
   * @returns True if transaction is checked.
   */
  public isChecked(): boolean | undefined {
    return this.payload.checked;
  }

  /**
    * Set the check state of the Transaction.
    * 
    * @param checked - The check state.
    * 
    * @returns This Transaction, for chainning.
  */
  public setChecked(checked: boolean): Transaction {
    this.payload.checked = checked;
    return this;
  }

  /**
   * @returns True if transaction is in trash.
   */
  public isTrashed(): boolean | undefined {
    return this.payload.trashed;
  }

  /**
   * @returns True if a transaction is locked by the book lock/closing date
   */
  public isLocked(): boolean {
    const date = this.getDate() || Utils.formatDateISO(new Date(), this.book.getTimeZone());
    const lockOrClosingDate = this.book.getMostRecentLockDate_();
    return lockOrClosingDate != null && (Utils.getIsoDateValue(lockOrClosingDate) >= Utils.getIsoDateValue(date));
  }

  /**
   * @returns All #hashtags used on the transaction.
   */
  public getTags(): string[] {
    return this.payload.tags || [];
  }


  /**
   * @returns All urls of the transaction.
   */
  public getUrls(): string[] {
    return this.payload.urls || [];
  }

  /**
   * Sets the Transaction urls. Url starts with https://
   * 
   * @param urls - The urls array.
   * 
   * @returns This Transaction, for chainning.
   */
  public setUrls(urls: string[]): Transaction {
    this.payload.urls = undefined;
    if (urls) {
      urls.forEach(url => {
        this.addUrl(url);
      });
    }
    return this;
  }

  /**
   * Add a url to the Transaction. Url starts with https://
   * 
   * @param url - The url to add.
   * 
   * @returns This Transaction, for chainning.
   */
  public addUrl(url: string): Transaction {
    if (this.payload.urls == null) {
      this.payload.urls = [];
    }
    if (url) {
      this.payload.urls.push(url);
    }
    return this;
  }

  /**
   * @returns The files attached to the transaction.
   */
  public getFiles(): File[] {
    if (this.payload.files && this.payload.files.length > 0) {
      const files = this.payload.files.map(file => new File(this.book, file));
      return files
    } else {
      return [];
    }
  }

  /**
   * 
   * Adds a file attachment to the Transaction.
   * 
   * Files MUST be previously created in the Book.
   * 
   * @param file - The file to add
   * 
   * @returns This Transaction, for chainning.
   */
  public addFile(file: File): Transaction {

    if (this.payload.files == null) {
      this.payload.files = [];
    }

    this.payload.files.push(file.json())
    return this;
  }

  /**
   * Check if the transaction has the specified tag.
   */
  public hasTag(tag: string): boolean {

    var tags = this.getTags();

    for (var i = 0; i < tags.length; i++) {
      if (tags[i] == tag) {
        return true;
      }
    }

    return false;
  }


  /**
   * Gets the custom properties stored in this Transaction.
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null ? { ...this.payload.properties } : {};
  }

  /**
   * Sets the custom properties of the Transaction
   * 
   * @param properties - Object with key/value pair properties
   * 
   * @returns This Transaction, for chainning. 
   */
  public setProperties(properties: { [key: string]: string }): Transaction {
    this.payload.properties = { ...properties };
    return this;
  }

  /**
   * Gets the property value for given keys. First property found will be retrieved
   * 
   * @param keys - The property key
   */
  public getProperty(...keys: string[]): string | undefined {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value = this.payload.properties != null ? this.payload.properties[key] : null
      if (value != null && value.trim() != '') {
        return value;
      }
    }
    return undefined;
  }

   /**
   * Gets the custom properties keys stored in this Transaction.
   */  
    public getPropertyKeys(): string[] {
      let properties = this.getProperties();
      let propertyKeys:string[] = []
      if (properties) {
        for (var key in properties) {
          if (Object.prototype.hasOwnProperty.call(properties, key)) {
              propertyKeys.push(key)
          }
        }
      }
      propertyKeys = propertyKeys.sort();
      return propertyKeys;
    } 

  /**
   * Sets a custom property in the Transaction.
   * 
   * @param key - The property key
   * @param value - The property value
   * 
   * @returns This Transaction, for chainning. 
   */
  public setProperty(key: string, value: string | null): Transaction {
    if (key == null || key.trim() == '') {
      return this;
    }
    if (this.payload.properties == null) {
      this.payload.properties = {};
    }
    if (!value) {
      value = ''
    }
    this.payload.properties[key] = value;
    return this;
  }

  /**
   * Delete a custom property
   * 
   * @param key - The property key
   * 
   * @returns This Transaction, for chainning. 
   */
  public deleteProperty(key: string): Transaction {
    this.setProperty(key, null);
    return this;
  }


  //ORIGIN ACCOUNT
  /**
   * @returns The credit account. The same as origin account.
   */
  public async getCreditAccount(): Promise<Account | undefined> {
    if (!this.payload.creditAccount) {
      return undefined;
    }
    return await this.book.getAccount(this.payload.creditAccount.id);

  }

  /**
   * @returns The credit account name.
   */
  public async getCreditAccountName(): Promise<string | undefined> {
    if (await this.getCreditAccount() != null) {
      return (await this.getCreditAccount())?.getName();
    } else {
      return "";
    }
  }

  /**
   * 
   * Sets the credit/origin Account of the Transaction. Same as from().
   * 
   * @param account - Account id, name or object.
   * 
   * @returns This Transaction, for chainning.
   */
  public setCreditAccount(account: Account | bkper.Account): Transaction {
    if (account instanceof Account) {
      if (account != null && account.getId() != null) {
        this.payload.creditAccount = account.json()
      }
    } else {
      if (account != null && account.id != null) {
        this.payload.creditAccount = account
      }
    }
    return this;
  }

  /**
   * 
   * Sets the credit/origin Account of the Transaction. Same as setCreditAccount().
   * 
   * @param account - Account id, name or object.
   * 
   * @returns This Transaction, for chainning.
   */
  public from(account: Account | bkper.Account): Transaction {
    return this.setCreditAccount(account);
  }


  //DESTINATION ACCOUNT
  /**
   * @returns The debit account. The same as destination account.
   * 
   */
  public async getDebitAccount(): Promise<Account | undefined> {
    if (!this.payload.debitAccount) {
      return undefined;
    }
    return await this.book.getAccount(this.payload.debitAccount.id);
  }

  /**
   * @returns The debit account name.
   */
  public async getDebitAccountName(): Promise<string | undefined> {
    if (await this.getDebitAccount() != null) {
      return (await this.getDebitAccount())?.getName();
    } else {
      return "";
    }
  }

  /**
   * 
   * Sets the debit/destination Account of the Transaction. Same as to().
   * 
   * @param account - Account id, name or object.
   * 
   * @returns This Transaction, for chainning.
   */
  public setDebitAccount(account: Account | bkper.Account): Transaction {
    if (account instanceof Account) {
      if (account != null && account.getId() != null) {
        this.payload.debitAccount = account.json()
      }
    } else {
      if (account != null && account.id != null) {
        this.payload.debitAccount = account
      }
    }
    return this;
  }

  /**
   * 
   * Sets the debit/destination Account of the Transaction. Same as setDebitAccount().
   * 
   * @param account - Account id, name or object.
   * 
   * @returns This Transaction, for chainning.
   */
  public to(account: Account | bkper.Account): Transaction {
    return this.setDebitAccount(account);
  }


  //AMOUNT
  /**
   * @returns The amount of the transaction.
   */
  public getAmount(): Amount | undefined {
    return this.payload.amount != null && this.payload.amount.trim() != '' ? new Amount(this.payload.amount) : undefined;
  }

  /**
   * @returns The amount of the transaction, formatted according to the Book format.
   */
  public getAmountFormatted(): string | undefined {
    const amount = this.getAmount();
    if (amount) {
      return this.book.formatValue(amount);
    }
    return undefined;
  }

  /**
   * 
   * Sets the amount of the Transaction.
   * 
   * @returns This Transaction, for chainning.
   */
  public setAmount(amount: Amount | number | string): Transaction {

    if (typeof amount == "string") {
      amount = Utils.parseValue(amount, this.book.getDecimalSeparator()) + '';
      this.payload.amount = amount.toString();
      return this;
    }

    amount = new Amount(amount);

    if (amount.eq(0)) {
      this.payload.amount = undefined;
      return this;
    }

    this.payload.amount = amount.abs().toString();

    return this;
  }

  /**
   * Get the absolute amount of this transaction if the given account is at the credit side, else null.
   * 
   * @param account - The account object, id or name.
   */
  public async getCreditAmount(account: Account | string): Promise<Amount | undefined> {
    let accountObject = await this.getAccount_(account);
    if (await this.isCredit(accountObject)) {
      return this.getAmount();
    }
    return undefined;
  }

  /**
   * Gets the absolute amount of this transaction if the given account is at the debit side, else null.
   * 
   * @param account - The account object, id or name.
   */
  public async getDebitAmount(account: Account | string): Promise<Amount | undefined> {
    let accountObject = await this.getAccount_(account);
    if (await this.isDebit(accountObject)) {
      return this.getAmount();
    }
    return undefined;
  }

  /**
   * Gets the [[Account]] at the other side of the transaction given the one in one side.
   * 
   * @param account - The account object, id or name.
   */
  public async getOtherAccount(account: Account | string): Promise<Account | undefined> {
    let accountObject = await this.getAccount_(account);
    if (await this.isCredit(accountObject)) {
      return await this.getDebitAccount();
    }
    if (await this.isDebit(accountObject)) {
      return await this.getCreditAccount();
    }
    return undefined;
  }

  /**
   * 
   * The account name at the other side of the transaction given the one in one side.
   * 
   * @param account - The account object, id or name.
   */
  public async getOtherAccountName(account: string | Account): Promise<string | undefined> {
    var otherAccount = await this.getOtherAccount(account);
    if (otherAccount != null) {
      return otherAccount.getName();
    } else {
      return "";
    }
  }

  /**
   * 
   * Tell if the given account is credit on the transaction
   * 
   * @param account - The account object
   */  
  public async isCredit(account?: Account): Promise<boolean> {
    return (await this.getCreditAccount()) != null && account != null && (await this.getCreditAccount())?.getNormalizedName() == account.getNormalizedName();
  }

  /**
   * 
   * Tell if the given account is debit on the transaction
   * 
   * @param account - The account object
   */  
  public async isDebit(account?: Account): Promise<boolean> {
    return (await this.getDebitAccount()) != null && account != null && (await this.getDebitAccount())?.getNormalizedName() == account.getNormalizedName();
  }


  /** @internal */
  private async getAccount_(account: Account | string): Promise<Account | undefined> {
    if (account == null || account instanceof Account) {
      return account as Account;
    }
    return await this.book.getAccount(account);
  }  


  //DESCRIPTION
  /**
   * @returns The description of this transaction.
   */
  public getDescription(): string {
    if (this.payload.description == null) {
      return "";
    }
    return this.payload.description;
  }

  /**
   * 
   * Sets the description of the Transaction.
   * 
   * @returns This Transaction, for chainning.
   */
  public setDescription(description: string): Transaction {
    this.payload.description = description;
    return this;
  }


  //DATE

  /**
   * @returns The Transaction date, in ISO format yyyy-MM-dd.
   */
  public getDate(): string | undefined{
    return this.payload.date;
  }

  /**
   * 
   * Sets the date of the Transaction.
   * 
   * @returns This Transaction, for chainning
   */
  public setDate(date: string | Date): Transaction {
    if (typeof date == "string") {
      if (date.indexOf('/') > 0) {
        let dateObject = Utils.parseDate(date, this.book.getDatePattern(), this.book.getTimeZone())
        this.payload.date = Utils.formatDateISO(dateObject, this.book.getTimeZone())
      } else if (date.indexOf('-')) {
        this.payload.date = date;
      }
    } else if (Object.prototype.toString.call(date) === '[object Date]') {
      this.payload.date = Utils.formatDateISO(date, this.book.getTimeZone())
    }
    return this;
  }

  /**
   * @returns The Transaction Date object, on the time zone of the [[Book]].
   */
  public getDateObject(): Date {
    return Utils.convertValueToDate(this.getDateValue(), this.book.getTimeZoneOffset());
  }

  /**
   * @returns The Transaction date number, in format YYYYMMDD.
   */
  public getDateValue(): number | undefined {
    return this.payload.dateValue;
  }

  /**
   * @returns The Transaction date, formatted on the date pattern of the [[Book]].
   */
  public getDateFormatted(): string | undefined {
    return this.payload.dateFormatted;
  }

  /**
   * @returns The date the transaction was created.
   */
  public getCreatedAt(): Date {
    return new Date(new Number(this.payload.createdAt).valueOf());
  }

  /**
   * @returns The date the transaction was created, formatted according to the date pattern of the [[Book]].
   */
  public getCreatedAtFormatted(): string {
    return Utils.formatDate(this.getCreatedAt(), this.book.getDatePattern() + " HH:mm:ss", this.book.getTimeZone());
  }

  /**
   * @returns The date the transaction was last updated.
   */
  public getUpdatedAt(): Date {
    return new Date(new Number(this.payload.updatedAt).valueOf());
  }

  /**
   * @returns The date the transaction was last updated, formatted according to the date pattern of the [[Book]].
   */
  public getUpdatedAtFormatted(): string {
    return Utils.formatDate(this.getUpdatedAt(), this.book.getDatePattern() + " HH:mm:ss", this.book.getTimeZone());
  }

  //EVOLVED BALANCES
  /** @internal */
  private getCaEvolvedBalance_(): Amount | undefined {
    return this.payload.creditAccount != null && this.payload.creditAccount.balance != null ? new Amount(this.payload.creditAccount.balance) : undefined;
  }

  /** @internal */
  private getDaEvolvedBalance_(): Amount | undefined {
    return this.payload.debitAccount != null && this.payload.debitAccount.balance != null ? new Amount(this.payload.debitAccount.balance) : undefined;
  }

  /**
   * Gets the balance that the [[Account]] has at that day, when listing transactions of that Account.
   * 
   * Evolved balances is returned when searching for transactions of a permanent [[Account]].
   * 
   * Only comes with the last posted transaction of the day.
   * 
   * @param raw - True to get the raw balance, no matter the credit nature of the [[Account]].
   */
  public async getAccountBalance(raw?: boolean): Promise<Amount | undefined> {
    var accountBalance = this.getCaEvolvedBalance_();
    var isCa = true;
    if (accountBalance == null) {
      accountBalance = this.getDaEvolvedBalance_();
      isCa = false;
    }
    if (accountBalance != null) {
      if (!raw) {
        var account = isCa ? await this.getCreditAccount() : await this.getDebitAccount();
        accountBalance = Utils.getRepresentativeValue(accountBalance, account?.isCredit());
      }
      return Utils.round(accountBalance, this.book.getFractionDigits());
    } else {
      return undefined;
    }
  }

  /**
   * Perform create new draft transaction.
   */
  public async create(): Promise<Transaction> {
    let operation = await TransactionService.createTransaction(this.book.getId(), this.payload);
    this.payload = operation.transaction || {};
    return this;
  }

  /**
   * Upddate transaction, applying pending changes.
   */
  public async update(): Promise<Transaction> {
    let operation = await TransactionService.updateTransaction(this.book.getId(), this.payload);
    this.payload = operation.transaction || {};
    return this;
  }


  /**
   * Perform check transaction.
   */
  public async check(): Promise<Transaction> {
    let operation = await TransactionService.checkTransaction(this.book.getId(), this.payload);
    this.payload.checked = operation.transaction?.checked;
    return this;
  }

  /**
   * Perform uncheck transaction.
   */
  public async uncheck(): Promise<Transaction> {
    let operation = await TransactionService.uncheckTransaction(this.book.getId(), this.payload);
    this.payload.checked = operation.transaction?.checked;
    return this;
  }

  /**
   * Perform post transaction, changing credit and debit [[Account]] balances.
   */
  public async post(): Promise<Transaction> {
    let operation = await TransactionService.postTransaction(this.book.getId(), this.payload);
    this.payload = operation.transaction || {};
    return this;
  }

  /**
   * Trash the transaction.
   */
  public async trash(): Promise<Transaction> {
    let operation = await TransactionService.trashTransaction(this.book.getId(), this.payload);
    this.payload.trashed = operation.transaction?.trashed;
    return this;
  }

  /**
   * Untrash the transaction.
   */
  public async untrash(): Promise<Transaction> {
    let operation = await TransactionService.restoreTransaction(this.book.getId(), this.payload);
    this.payload.trashed = operation.transaction?.trashed;
    return this;
  }

  
    
  /** @deprecated */
  public async remove(): Promise<Transaction> {
    return this.trash();
  }

  /** @deprecated */
  public async restore(): Promise<Transaction> {
    return this.untrash();
  }



}