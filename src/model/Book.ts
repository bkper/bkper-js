import * as AccountService from '../service/account-service.js';
import * as BookService from '../service/book-service.js';
import * as BalancesService from '../service/balances-service.js';
import * as FileService from '../service/file-service.js';
import * as GroupService from '../service/group-service.js';
import * as IntegrationService from '../service/integration-service.js';
import * as TransactionService from '../service/transaction-service.js';
import * as EventService from '../service/event-service.js';
import * as Utils from '../utils.js';
import { Account } from './Account.js';
import { Amount } from './Amount.js';
import { Collection } from './Collection.js';
import { DecimalSeparator, Month, Period, Permission, Visibility } from './Enums.js';
import { EventList } from './EventList.js';
import { File } from './File.js';
import { Group } from './Group.js';
import { Integration } from './Integration.js';
import { Transaction } from './Transaction.js';
import { TransactionList } from './TransactionList.js';
import { BalancesReport } from './BalancesReport.js';
import { App } from './App.js';
import { Event } from './Event.js';

/**
 *
 * A Book represents [General Ledger](https://en.wikipedia.org/wiki/General_ledger) for a company or business, but can also represent a [Ledger](https://en.wikipedia.org/wiki/Ledger) for a project or department
 *
 * It contains all [[Accounts]] where [[Transactions]] are recorded/posted;
 * 
 * @public
 */
export class Book {

  public payload: bkper.Book;

  /** @internal */
  private collection?: Collection;

  /** @internal */
  private apps?: App[];

  /** @internal */
  private idGroupMap?: Map<string, Group>;

  /** @internal */
  parentIdGroupsMap?: Map<string, Map<string, Group>>;

  /** @internal */
  private idAccountMap?: Map<string, Account>;

  constructor(payload?: bkper.Book) {
    this.payload = payload || {};
    if (this.payload.permission == Permission.RECORDER) {
      this.payload.groups = this.payload.groups || [];
      this.payload.accounts = this.payload.accounts || [];
    }
    this.mapGroups(this.payload.groups);
    this.mapAccounts(this.payload.accounts);
  }

  /**
   * @returns An immutable copy of the json payload
   */
  public json(): bkper.Book {
    return {...this.payload};
  }

  /**
   * Same as bookId param
   */
  public getId(): string {
    return this.payload.id || '';
  }

  /**
   * @returns The name of this Book
   */
  public getName(): string | undefined {
    return this.payload.name;
  }

  /**
   * 
   * Sets the name of the Book.
   * 
   * @returns This Book, for chainning.
   */
  public setName(name: string): Book {
    this.payload.name = name;
    return this;
  }

  /**
   * @returns The number of fraction digits supported by this Book. Same as getDecimalPlaces
   */
  public getFractionDigits(): number | undefined {
    return this.payload.fractionDigits;
  }

  /**
   * @returns The number of decimal places supported by this Book. Same as getFractionDigits
   */
  public getDecimalPlaces(): number | undefined {
    return this.getFractionDigits();
  }

  /**
   * 
   * Sets the number of fraction digits (decimal places) supported by this Book
   * 
   * @returns This Book, for chainning.
   */
  public setFractionDigits(fractionDigits: number): Book {
    this.payload.fractionDigits = fractionDigits;
    return this;
  }

  /**
   * @returns The period slice for balances visualization
   */
  public getPeriod(): Period {
    return this.payload.period as Period;
  }

  /**
   * Sets the period slice for balances visualization
   * 
   * @returns This Book, for chainning.
   */
  public setPeriod(period: Period): Book {
    this.payload.period = period;
    return this;
  }

  /**
   * @returns The start month when YEAR period set
   */
  public getPeriodStartMonth(): Month {
    return this.payload.periodStartMonth as Month;
  }

  /**
   * Sets the start month when YEAR period set
   * 
   * @returns This Book, for chainning.
   */
  public setPeriodStartMonth(month: Month): Book {
    this.payload.periodStartMonth = month;
    return this;
  }

  /**
   * @returns The transactions pagination page size
   */
  public getPageSize(): number | undefined {
    return this.payload.pageSize;
  }

  /**
   * Sets the transactions pagination page size
   * 
   * @returns This Book, for chainning.
   */
  public setPageSize(pageSize: number): Book {
    this.payload.pageSize = pageSize;
    return this;
  }


  /**
   * @returns The name of the owner of the Book
   */
  public getOwnerName(): string | undefined {
    return this.payload.ownerName;
  }

  /**
   * @returns The permission for the current user
   */
  public getPermission(): Permission {
    return this.payload.permission as Permission;
  }

  /** 
   * @returns The collection of this book
   */
  public getCollection(): Collection | undefined {
    if (this.payload.collection != null && this.collection == null) {
      this.collection = new Collection(this.payload.collection);
    }
    return this.collection;
  }


  /**
   * @returns The date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
   */
  public getDatePattern(): string | undefined {
    return this.payload.datePattern;
  }

  /**
   * 
   * Sets the date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
   * 
   * @returns This Book, for chainning.
   */
  public setDatePattern(datePattern: string): Book {
    this.payload.datePattern = datePattern;
    return this;
  }


  /**
   * @returns The lock date of the Book in ISO format yyyy-MM-dd
   */
  public getLockDate(): string | undefined {
    return this.payload.lockDate;
  }

  /**
   * 
   * Sets the lock date of the Book in ISO format yyyy-MM-dd.
   * 
   * @returns This Book, for chainning.
   */
  public setLockDate(lockDate: string | null): Book {
    if (lockDate == null) {
      lockDate = "1900-00-00";
    }
    this.payload.lockDate = lockDate;
    return this;
  }

  /**
   * @returns The closing date of the Book in ISO format yyyy-MM-dd 
   */
  public getClosingDate(): string | undefined {
    return this.payload.closingDate;
  }

  /**
   * 
   * Sets the closing date of the Book in ISO format yyyy-MM-dd.
   * 
   * @returns This Book, for chainning.
   */
  public setClosingDate(closingDate: string | null): Book {
    if (closingDate == null) {
      closingDate = "1900-00-00";
    }
    this.payload.closingDate = closingDate;
    return this;
  }

  /**
   * @returns The decimal separator of the Book
   */
  public getDecimalSeparator(): DecimalSeparator {
    return this.payload.decimalSeparator as DecimalSeparator;
  }

  /**
   * 
   * Sets the decimal separator of the Book
   * 
   * @returns This Book, for chainning.
   */
  public setDecimalSeparator(decimalSeparator: DecimalSeparator): Book {
    this.payload.decimalSeparator = decimalSeparator;
    return this;
  }


  /**
   * @returns The time zone of the Book
   */
  public getTimeZone(): string | undefined {
    return this.payload.timeZone;
  }

  /**
   * 
   * Sets the time zone of the Book
   * 
   * @returns This Book, for chainning.
   */
  public setTimeZone(timeZone: string): Book {
    this.payload.timeZone = timeZone;
    return this;
  }

  /**
   * @returns The time zone offset of the book, in minutes
   */
  public getTimeZoneOffset(): number | undefined {
    return this.payload.timeZoneOffset;
  }

  /**
   * @returns The auto post status of the Book
   */
  public getAutoPost(): boolean | undefined {
    return this.payload.autoPost;
  }

  /**
   * 
   * Sets the auto post status of the Book
   * 
   * @returns This Book, for chainning.
   */
  public setAutoPost(autoPost: boolean): Book {
    this.payload.autoPost = autoPost;
    return this;
  }

  /**
   * @returns The last update date of the book, in in milliseconds
   */
  public getLastUpdateMs(): number | undefined {
    return this.payload.lastUpdateMs ? +this.payload.lastUpdateMs : undefined;
  }

  /**
   * @returns The total number of posted transactions
   */
  public getTotalTransactions(): number {
    return this.payload.totalTransactions ? +(this.payload.totalTransactions) : 0;
  }

  /**
   * @returns The total number of posted transactions on current month
   */
  public getTotalTransactionsCurrentMonth(): number {
    return this.payload.totalTransactionsCurrentMonth ? +(this.payload.totalTransactionsCurrentMonth) : 0;
  }

  /**
   * @returns The total number of posted transactions on current year
   */
  public getTotalTransactionsCurrentYear(): number {
    return this.payload.totalTransactionsCurrentYear ? +(this.payload.totalTransactionsCurrentYear) : 0;
  }

  /**
   * @returns The visibility of the book
   */
  public getVisibility(): Visibility {
    return this.payload.visibility as Visibility;
  }

  /**
   * Gets the custom properties stored in this Book
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null ? { ...this.payload.properties } : {};
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
   * Sets the custom properties of the Book
   * 
   * @param properties - Object with key/value pair properties
   * 
   * @returns This Book, for chainning. 
   */
  public setProperties(properties: { [key: string]: string }): Book {
    this.payload.properties = { ...properties };
    return this;
  }

  /**
   * Sets a custom property in the Book.
   * 
   * @param key - The property key
   * @param value - The property value
   * 
   * @returns This Book, for chainning. 
   */
  public setProperty(key: string, value: string | null): Book {
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
   * Formats a date according to date pattern of the Book.
   * 
   * @param date - The date to format as string.
   * @param timeZone - The output timezone of the result. Default to script's timeZone
   * 
   * @returns The date formated
   */
  public formatDate(date: Date, timeZone?: string): string {
    if (timeZone == null || timeZone.trim() == "") {
      timeZone = this.getTimeZone();
    }
    return Utils.formatDate(date, this.getDatePattern(), timeZone);
  }

  /**
   * Parse a date string according to date pattern and timezone of the Book. 
   * 
   * Also parse ISO yyyy-mm-dd format.
   */
  public parseDate(date: string): Date {
    return Utils.parseDate(date, this.getDatePattern(), this.getTimeZone());
  }


  /**
   * Formats a value according to [[DecimalSeparator]] and fraction digits of the Book.
   * 
   * @param value - The value to be formatted.
   * 
   * @returns The value formated
   */
  public formatValue(value: Amount | number | null | undefined): string {
    if (!value) {
      return ''
    }
    return Utils.formatValue(value, this.getDecimalSeparator(), this.getFractionDigits());
  }

  /**
   * Parse a value string according to [[DecimalSeparator]] and fraction digits of the Book.
   */
  public parseValue(value: string): Amount | undefined {
    return Utils.parseValue(value, this.getDecimalSeparator());
  }


  /**
   * Rounds a value according to the number of fraction digits of the Book
   * 
   * @param value - The value to be rounded
   * 
   * @returns The value rounded
   */
  public round(value: Amount | number): Amount {
    return Utils.round(value, this.getFractionDigits());
  }

  /**
   * Create [[Transactions]] on the Book, in batch. 
   */
  public async batchCreateTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    let transactionPayloads: bkper.Transaction[] = [];
    transactions.forEach(tx => transactionPayloads.push(tx.json()))
    transactionPayloads = await TransactionService.createTransactionsBatch(this.getId(), transactionPayloads);
    transactions = transactionPayloads.map(tx => new Transaction(this, tx));
    return transactions;
  }

  /**
   * Trash [[Transactions]] on the Book, in batch. 
   */
  public async batchTrashTransactions(transactions: Transaction[]): Promise<void> {
    let transactionPayloads: bkper.Transaction[] = [];
    transactions.forEach(tx => transactionPayloads.push(tx.json()))
    await TransactionService.trashTransactionsBatch(this.getId(), transactionPayloads);
  }

  /**
   * Replay [[Events]] on the Book, in batch. 
   */
  public async batchReplayEvents(events: Event[], errorOnly?: boolean): Promise<void> {
    const eventIds = events.map(event => event.getId());
    const eventPayloads: bkper.Event[] = eventIds.map(id => ({ id: id }));
    const eventList: bkper.EventList = { items: eventPayloads };
    await EventService.replayEventsBatch(this, eventList, errorOnly);
  }

  /**
   * Create [[Accounts]] on the Book, in batch.
   * 
   * @return The created Accounts
   */
  public async batchCreateAccounts(accounts: Account[]): Promise<Account[]> {
    if (accounts.length > 0) {
      const accountList: bkper.AccountList = { items: accounts.map(a => a.json()) };
      const payloads = await AccountService.createAccounts(this.getId(), accountList);
      const createdAccounts: Account[] = [];
      for (const payload of payloads) {
        const account = new Account(this, payload);
        createdAccounts.push(account);
        this.updateAccountCache(account);
      }
      return createdAccounts;
    }
    return [];
  }

  /**
   * Create [[Groups]] on the Book, in batch.
   * 
   * @return The created Groups
   */
  public async batchCreateGroups(groups: Group[]): Promise<Group[]> {
    if (groups.length > 0) {
      const groupList: bkper.GroupList = { items: groups.map(g => g.json()) };
      const payloads = await GroupService.createGroups(this.getId(), groupList);
      const createdGroups: Group[] = [];
      for (const payload of payloads) {
        const group = new Group(this, payload);
        createdGroups.push(group);
        this.updateGroupCache(group);
        if (this.idGroupMap) {
          group.buildGroupTree(this.idGroupMap);
        }
      }
      return createdGroups;
    }
    return [];
  }

  /**
   * Trigger [Balances Audit](https://help.bkper.com/en/articles/4412038-balances-audit) async process.
   */
  public audit(): void {
    BookService.audit(this.getId());
  }

  /**
   * Retrieve installed [[Apps]] for this Book
   * 
   * @returns The Apps objects
   */
  public async getApps(): Promise<App[]> {
    if (this.apps != null) {
      return this.apps;
    }
    const appsPlain = await BookService.getApps(this.getId());
    this.apps = appsPlain.map(a => new App(a));
    return this.apps;
  }

  /**
   * Gets the existing [[Integrations]] in the Book.
   * 
   * @returns The existing Integration objects
   */
  public async getIntegrations(): Promise<Integration[]> {
    const integrationsPlain = await IntegrationService.listIntegrations(this.getId());
    const integrations = integrationsPlain.map(i => new Integration(i));
    return integrations;
  }

  /**
   * Creates a new [[Integration]] in the Book.
   * 
   * @param integration - The Integration object or wrapped plain json
   * 
   * @returns The created Integration object
   */
  public async createIntegration(integration: bkper.Integration | Integration): Promise<Integration> {
    if (integration instanceof Integration) {
      integration = await IntegrationService.createIntegration(this.getId(), integration.json())
    } else {
      integration = await IntegrationService.createIntegration(this.getId(), integration)
    }
    return new Integration(integration);
  }

  /**
   * Updates an existing [[Integration]] in the Book.
   * 
   * @param integration - The Integration wrapped plain json
   * 
   * @returns The updated Integration object
   */
  public async updateIntegration(integration: bkper.Integration): Promise<Integration> {
    if (integration instanceof Integration) {
      integration = await IntegrationService.updateIntegration(this.getId(), integration.json())
    } else {
      integration = await IntegrationService.updateIntegration(this.getId(), integration)
    }
    return new Integration(integration);
  }


  /**
   * Gets an [[Account]] object
   * 
   * @param idOrName - The id or name of the Account
   * 
   * @returns The matching Account object
   */
  public async getAccount(idOrName?: string): Promise<Account | undefined> {

    if (!idOrName || idOrName.trim() == '') {
      return undefined;
    }

    if (this.idAccountMap) {
      return this.idAccountMap.get(idOrName);
    } else {
      const accountPayload = await AccountService.getAccount(this.getId(), idOrName);
      if (accountPayload) {
        return new Account(this, accountPayload);
      }
    }

    return undefined;
  }

  /** @internal */
  getGroupsMap(): Map<string, Group> | undefined {
    return this.idGroupMap;
  }

  /** @internal */
  updateGroupCache(group: Group, previousParentId?: string) {
    if (this.idGroupMap) {
      const id = group.getId();
      if (id) {
        this.idGroupMap.set(id, group);
      }
      const parentId = group.payload.parent?.id;
      if ((previousParentId || '') !== (parentId || '')) {
        group.destroyGroupTree(this.idGroupMap, previousParentId);
      }
      group.buildGroupTree(this.idGroupMap);
    }
  }

  /** @internal */
  removeGroupCache(group: Group) {
    if (this.idGroupMap) {
      this.idGroupMap.delete(group.getId() || '');
      group.destroyGroupTree(this.idGroupMap);
    }
  }

  /** @internal */
  updateAccountCache(account: Account, previousGroupIds?: string[]) {
    if (this.idAccountMap) {
      const id = account.getId();
      if (id) {
        this.idAccountMap.set(id, account);
      }
      if (previousGroupIds && previousGroupIds.length > 0) {
        this.unlinkAccountsAndGroups(account, previousGroupIds);
      }
      this.linkAccountsAndGroups(account);
    }
  }

  /** @internal */
  private linkAccountsAndGroups(account: Account) {
    const groupPayloads = account.payload.groups || [];
    for (const groupPayload of groupPayloads) {
      const group = this.idGroupMap?.get(groupPayload.id || "");
      if (group != null) {
        group.addAccount(account);
        // TODO add known group to account
      }
    }
  }

  /** @internal */
  private unlinkAccountsAndGroups(account: Account, groupIds?: string[]) {
    if (!groupIds) {
      groupIds = account.payload.groups?.map(g => g.id || "") || [];
    }
    for (const groupId of groupIds) {
      const group = this.idGroupMap?.get(groupId || "");
      if (group != null) {
        group.removeAccount(account);
      }
    }
  }

  /** @internal */
  removeAccountCache(account: Account) {
    if (this.idAccountMap) {
      this.idAccountMap.delete(account.getId() || '');
    }
    this.unlinkAccountsAndGroups(account);
  }

  /** @internal */
  getMostRecentLockDate_(): string | null {
    const closingDate = this.getClosingDate();
    const lockDate = this.getLockDate();
    if (!closingDate && !lockDate) {
      return null;
    }
    if (!closingDate && lockDate) {
      return lockDate;
    }
    if (closingDate && !lockDate) {
      return closingDate;
    }
    if (Utils.getIsoDateValue(closingDate!) > Utils.getIsoDateValue(lockDate!)) {
      return closingDate!;
    } else {
      return lockDate!;
    }
  }

  /**
   * Gets a [[Group]] object
   * 
   * @param idOrName - The id or name of the Group
   * 
   * @returns The matching Group object
   */
  public async getGroup(idOrName?: string): Promise<Group | undefined> {

    if (!idOrName || idOrName.trim() == '') {
      return undefined;
    }

    if (this.idGroupMap) {
      return this.idGroupMap.get(idOrName);
    } else {
      const groupPayload = await GroupService.getGroup(this.getId(), idOrName);
      if (groupPayload) {
        return new Group(this, groupPayload);
      }
    }

    return undefined;
  }


  /**
   * Gets all [[Groups]] of this Book
   * 
   * @returns The retrieved Group objects
   */
  public async getGroups(): Promise<Group[]> {
    if (this.idGroupMap) {
      return Array.from(this.idGroupMap.values())
    }
    let groups = await GroupService.getGroups(this.getId());
    return this.mapGroups(groups);
  }

  private mapGroups(groups?: bkper.Group[]) {
    if (!groups) {
      return [];
    }
    let groupsObj = groups.map(group => new Group(this, group));
    this.idGroupMap = new Map<string, Group>();
    this.parentIdGroupsMap = new Map<string, Map<string, Group>>();
    for (const group of groupsObj) {
      this.updateGroupCache(group);
    }
    for (const group of groupsObj) {
      group.buildGroupTree(this.idGroupMap);
    }
    return groupsObj;
  }

  /**
   * Gets all [[Accounts]] of this Book
   * 
   * @returns The retrieved Account objects
   */
  public async getAccounts(): Promise<Account[]> {
    if (this.idAccountMap) {
      return Array.from(this.idAccountMap.values());
    }
    let accounts = await AccountService.getAccounts(this.getId());
    return this.mapAccounts(accounts);
  }

  private mapAccounts(accounts?: bkper.Account[]) {
    if (!accounts) {
      return [];
    }
    let accountsObj = accounts.map(account => new Account(this, account));
    this.idAccountMap = new Map<string, Account>();
    for (const account of accountsObj) {
      this.updateAccountCache(account);
    }
    this.ensureGroupsAccountMapsLoaded();
    return accountsObj;
  }

  /** @internal */
  private ensureGroupsAccountMapsLoaded(): void {
    if (this.idGroupMap) {
      for (const group of this.idGroupMap.values()) {
        if (group.accounts == null) {
          group.accounts = new Map<string, Account>();
        }
      }
    }
  }

  /**
   * Lists transactions in the Book based on the provided query, limit, and cursor, for pagination.
   * 
   * @param query - The query string to filter transactions
   * @param limit - The maximum number of transactions to return. Default to 100, max to 1000;
   * @param cursor - The cursor for pagination
   * 
   * @returns A TransactionPage object containing the list of transactions
   */
  public async listTransactions(query?: string, limit?: number, cursor?: string): Promise<TransactionList> {
    const transactionsList = await TransactionService.listTransactions(this.getId(), query, limit, cursor);
    return new TransactionList(this, transactionsList);
  }

  
  /**
   * Lists events in the Book based on the provided parameters.
   * 
   * @param afterDate - The start date (inclusive) for the events search range, in [RFC3339](https://en.wikipedia.org/wiki/ISO_8601#RFC_3339) format. Can be null.
   * @param beforeDate - The end date (exclusive) for the events search range, in [RFC3339](https://en.wikipedia.org/wiki/ISO_8601#RFC_3339) format. Can be null.
   * @param onError - True to search only for events on error.
   * @param resourceId - The ID of the event's resource (Transaction, Account, or Group). Can be null.
   * @param limit - The maximum number of events to return.
   * @param cursor - The cursor for pagination. Can be null.
   * 
   * @returns An EventList object containing the list of events.
   */
  public async listEvents(afterDate: string | null, beforeDate: string | null, onError: boolean, resourceId: string | null, limit: number, cursor?: string): Promise<EventList> {
    const eventsList = await EventService.listEvents(this, afterDate, beforeDate, onError, resourceId, limit, cursor);
    return new EventList(this, eventsList);
  }

  /**
   * Retrieve a transaction by id
   */
  public async getTransaction(id: string): Promise<Transaction | undefined> {
    let wrapped = await TransactionService.getTransaction(this.getId(), id);
    if (!wrapped) {
      return undefined;
    }
    let transaction = new Transaction(this, wrapped);
    return transaction;
  }

  /** 
   * Retrieve a file by id
   */
  public async getFile(id: string): Promise<File> {
    let wrapped = await FileService.getFile(this.getId(), id);
    let file = new File(this, wrapped);
    return file;
  }

  /**
   * Performs create new Book.
   * 
   * @returns The created Book object
   */
  public async create(): Promise<Book> {
    this.payload = await BookService.createBook(this.payload);
    return this;
  }

  /**
   * Perform update Book, applying pending changes.
   */
  public async update(): Promise<Book> {
    this.payload = await BookService.updateBook(this.getId(), this.payload);
    return this;
  }

    /**
   *
   * Create a [[BalancesReport]] based on query
   * 
   * @param query The balances report query
   * 
   * @return The balances report
   * 
   * Example:
   * 
   * ```js
   * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgPXjx7oKDA");
   * 
   * var balancesReport = book.getBalancesReport("group:'Equity' after:7/2018 before:8/2018");
   * 
   * var accountBalance = balancesReport.getBalancesContainer("Bank Account").getCumulativeBalance();
   * ```
   */
  public async getBalancesReport(query: string): Promise<BalancesReport> {
    const balances = await BalancesService.getBalances(this.getId(), query);
    return new BalancesReport(this, balances);
  }

}
