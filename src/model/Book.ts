import * as AccountService from '../service/account-service.js';
import * as BookService from '../service/book-service.js';
import * as QueryService from '../service/query-service.js';
import * as BalancesService from '../service/balances-service.js';
import * as FileService from '../service/file-service.js';
import * as GroupService from '../service/group-service.js';
import * as IntegrationService from '../service/integration-service.js';
import * as TransactionService from '../service/transaction-service.js';
import * as EventService from '../service/event-service.js';
import * as CollaboratorService from '../service/collaborator-service.js';
import * as Utils from '../utils.js';
import { Config } from './Config.js';
import { ResourceProperty } from './ResourceProperty.js';
import { Account } from './Account.js';
import { Amount } from './Amount.js';
import { Collaborator } from './Collaborator.js';
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
import { Query } from './Query.js';
import { Bkper } from './Bkper.js';
import { Backlog } from './Backlog.js';
import { AccountsDataTableBuilder } from '../builders/AccountsDataTableBuilder.js';
import { GroupsDataTableBuilder } from '../builders/GroupsDataTableBuilder.js';
import { TransactionsDataTableBuilder } from '../builders/TransactionsDataTableBuilder.js';

/**
 * A Book represents a [General Ledger](https://en.wikipedia.org/wiki/General_ledger) for a company or business, but can also represent a [Ledger](https://en.wikipedia.org/wiki/Ledger) for a project or department
 *
 * It contains all [[Accounts]] where [[Transactions]] are recorded/posted;
 *
 * @public
 */
export class Book extends ResourceProperty<bkper.Book> {
    private config?: Config;

    private allGroupsLoaded: boolean = false;
    private allAccountsLoaded: boolean = false;

    /** @internal */
    private collection?: Collection;

    /** @internal */
    private apps?: App[];

    /** @internal */
    queries?: Query[];

    /** @internal */
    collaborators?: Collaborator[];

    /** @internal */
    private idGroupMap?: Map<string, Group>;

    /** @internal */
    private nameGroupMap?: Map<string, Group>;

    /** @internal */
    private idAccountMap?: Map<string, Account>;

    /** @internal */
    private nameAccountMap?: Map<string, Account>;

    constructor(payload?: bkper.Book, config?: Config) {
        super(payload);
        this.config = config;
        if (this.payload.permission == Permission.RECORDER) {
            this.payload.groups = this.payload.groups || [];
            this.payload.accounts = this.payload.accounts || [];
        }
        this.allGroupsLoaded = this.mapGroups(this.payload.groups);
        this.allAccountsLoaded = this.mapAccounts(this.payload.accounts);
    }

    /** @internal */
    public getConfig(): Config {
        return this.config || Bkper.globalConfig;
    }

    /**
     * Gets the unique identifier of this Book.
     *
     * @returns This Book's unique identifier
     */
    public getId(): string {
        return this.payload.id || '';
    }

    /**
     * Gets the name of this Book.
     *
     * @returns The name of this Book
     */
    public getName(): string | undefined {
        return this.payload.name;
    }

    /**
     * Sets the name of the Book.
     *
     * @param name - The name to set
     *
     * @returns This Book, for chaining
     */
    public setName(name: string): Book {
        this.payload.name = name;
        return this;
    }

    /**
     * Gets the number of fraction digits supported by this Book.
     *
     * @returns The number of fraction digits supported by this Book. Same as getDecimalPlaces
     */
    public getFractionDigits(): number | undefined {
        return this.payload.fractionDigits;
    }

    /**
     * Gets the number of decimal places supported by this Book.
     *
     * @returns The number of decimal places supported by this Book. Same as getFractionDigits
     */
    public getDecimalPlaces(): number | undefined {
        return this.getFractionDigits();
    }

    /**
     * Sets the number of fraction digits (decimal places) supported by this Book.
     *
     * @param fractionDigits - The number of fraction digits to set (0 to 8)
     *
     * @returns This Book, for chaining
     */
    public setFractionDigits(fractionDigits: number): Book {
        this.payload.fractionDigits = fractionDigits;
        return this;
    }

    /**
     * Gets the period slice for balances visualization.
     *
     * @returns The period slice for balances visualization
     */
    public getPeriod(): Period {
        return this.payload.period as Period;
    }

    /**
     * Sets the period slice for balances visualization.
     *
     * @param period - The period to set
     *
     * @returns This Book, for chaining
     */
    public setPeriod(period: Period): Book {
        this.payload.period = period;
        return this;
    }

    /**
     * Gets the start month when YEAR period is set.
     *
     * @returns The start month when YEAR period is set
     */
    public getPeriodStartMonth(): Month {
        return this.payload.periodStartMonth as Month;
    }

    /**
     * Sets the start month when YEAR period is set.
     *
     * @param month - The start month to set
     *
     * @returns This Book, for chaining
     */
    public setPeriodStartMonth(month: Month): Book {
        this.payload.periodStartMonth = month;
        return this;
    }

    /**
     * Gets the transactions pagination page size.
     *
     * @returns The transactions pagination page size
     */
    public getPageSize(): number | undefined {
        return this.payload.pageSize;
    }

    /**
     * Sets the transactions pagination page size.
     *
     * @param pageSize - The page size to set
     *
     * @returns This Book, for chaining
     */
    public setPageSize(pageSize: number): Book {
        this.payload.pageSize = pageSize;
        return this;
    }

    /**
     * Gets the name of the owner of the Book.
     *
     * @returns The name of the owner of the Book
     */
    public getOwnerName(): string | undefined {
        return this.payload.ownerName;
    }

    /**
     * Gets the permission for the current user in this Book.
     *
     * @returns The permission for the current user in this Book
     */
    public getPermission(): Permission {
        return this.payload.permission as Permission;
    }

    /**
     * Gets the collection of this Book, if any.
     *
     * @returns The collection of this Book, if any
     */
    public getCollection(): Collection | undefined {
        if (this.payload.collection != null && this.collection == null) {
            this.collection = new Collection(this.payload.collection, this.config);
        }
        return this.collection;
    }

    /**
     * Gets the date pattern of the Book.
     *
     * @returns The date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
     */
    public getDatePattern(): string {
        return this.payload.datePattern!;
    }

    /**
     * Sets the date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
     *
     * @param datePattern - The date pattern to set
     *
     * @returns This Book, for chaining
     */
    public setDatePattern(datePattern: string): Book {
        this.payload.datePattern = datePattern;
        return this;
    }

    /**
     * Gets the lock date of the Book in ISO format yyyy-MM-dd.
     *
     * @returns The lock date of the Book in ISO format yyyy-MM-dd
     */
    public getLockDate(): string | undefined {
        return this.payload.lockDate;
    }

    /**
     * Sets the lock date of the Book in ISO format yyyy-MM-dd.
     *
     * @param lockDate - The lock date to set in ISO format yyyy-MM-dd
     *
     * @returns This Book, for chaining
     */
    public setLockDate(lockDate: string | null): Book {
        if (lockDate == null) {
            lockDate = '1900-00-00';
        }
        this.payload.lockDate = lockDate;
        return this;
    }

    /**
     * Gets the closing date of the Book in ISO format yyyy-MM-dd.
     *
     * @returns The closing date of the Book in ISO format yyyy-MM-dd
     */
    public getClosingDate(): string | undefined {
        return this.payload.closingDate;
    }

    /**
     * Sets the closing date of the Book in ISO format yyyy-MM-dd.
     *
     * @param closingDate - The closing date to set in ISO format yyyy-MM-dd
     *
     * @returns This Book, for chaining
     */
    public setClosingDate(closingDate: string | null): Book {
        if (closingDate == null) {
            closingDate = '1900-00-00';
        }
        this.payload.closingDate = closingDate;
        return this;
    }

    /**
     * Gets the decimal separator of the Book.
     *
     * @returns The decimal separator of the Book
     */
    public getDecimalSeparator(): DecimalSeparator {
        return this.payload.decimalSeparator as DecimalSeparator;
    }

    /**
     * Sets the decimal separator of the Book
     *
     * @param decimalSeparator - The decimal separator to set
     *
     * @returns This Book, for chaining
     */
    public setDecimalSeparator(decimalSeparator: DecimalSeparator): Book {
        this.payload.decimalSeparator = decimalSeparator;
        return this;
    }

    /**
     * Gets the time zone of the Book.
     *
     * @returns The time zone of the Book
     */
    public getTimeZone(): string | undefined {
        return this.payload.timeZone;
    }

    /**
     * Sets the time zone of the Book.
     *
     * @param timeZone - The time zone to set
     *
     * @returns This Book, for chaining
     */
    public setTimeZone(timeZone: string): Book {
        this.payload.timeZone = timeZone;
        return this;
    }

    /**
     * Gets the time zone offset of the book, in minutes.
     *
     * @returns The time zone offset of the book, in minutes
     */
    public getTimeZoneOffset(): number | undefined {
        return this.payload.timeZoneOffset;
    }

    /**
     * Gets the auto post status of the Book.
     *
     * @returns The auto post status of the Book
     */
    public getAutoPost(): boolean | undefined {
        return this.payload.autoPost;
    }

    /**
     * Sets the auto post status of the Book.
     *
     * @param autoPost - The auto post status to set
     *
     * @returns This Book, for chaining
     */
    public setAutoPost(autoPost: boolean): Book {
        this.payload.autoPost = autoPost;
        return this;
    }

    /**
     * Gets the last update date of the book, in milliseconds.
     *
     * @returns The last update date of the book, in milliseconds
     */
    public getLastUpdateMs(): number | undefined {
        return this.payload.lastUpdateMs ? +this.payload.lastUpdateMs : undefined;
    }

    /**
     * Gets the total number of posted transactions.
     *
     * @returns The total number of posted transactions
     */
    public getTotalTransactions(): number {
        return this.payload.totalTransactions ? +this.payload.totalTransactions : 0;
    }

    /**
     * Gets the total number of posted transactions on current month.
     *
     * @returns The total number of posted transactions on current month
     */
    public getTotalTransactionsCurrentMonth(): number {
        return this.payload.totalTransactionsCurrentMonth
            ? +this.payload.totalTransactionsCurrentMonth
            : 0;
    }

    /**
     * Gets the total number of posted transactions on current year.
     *
     * @returns The total number of posted transactions on current year
     */
    public getTotalTransactionsCurrentYear(): number {
        return this.payload.totalTransactionsCurrentYear
            ? +this.payload.totalTransactionsCurrentYear
            : 0;
    }

    /**
     * Gets the visibility of the book.
     *
     * @returns The visibility of the book
     */
    public getVisibility(): Visibility {
        return this.payload.visibility as Visibility;
    }

    /**
     * Sets the visibility of the book.
     *
     * @param visibility - The visibility to set
     *
     * @returns This Book, for chaining
     */
    public setVisibility(visibility: Visibility): Book {
        this.payload.visibility = visibility;
        return this;
    }

    /**
     * Formats a date according to date pattern of the Book.
     *
     * @param date - The date to format as string.
     * @param timeZone - The output timezone of the result. Default to script's timeZone
     *
     * @returns The formatted date
     */
    public formatDate(date: Date, timeZone?: string): string {
        if (timeZone == null || timeZone.trim() == '') {
            timeZone = this.getTimeZone();
        }
        return Utils.formatDate(date, this.getDatePattern(), timeZone);
    }

    /**
     * Parse a date string according to date pattern and timezone of the Book. Also parse ISO yyyy-mm-dd format.
     *
     * @param date - The date string to parse
     *
     * @returns The parsed Date object
     */
    public parseDate(date: string): Date {
        return Utils.parseDate(date, this.getDatePattern(), this.getTimeZone());
    }

    /**
     * Formats a value according to [[DecimalSeparator]] and fraction digits of the Book.
     *
     * @param value - The value to be formatted.
     *
     * @returns The formatted value
     */
    public formatValue(value: Amount | number | null | undefined): string {
        if (!value) {
            return '';
        }
        return Utils.formatValue(value, this.getDecimalSeparator(), this.getFractionDigits());
    }

    /**
     * Parse a value string according to [[DecimalSeparator]] and fraction digits of the Book.
     *
     * @param value - The value string to parse
     *
     * @returns The parsed Amount or undefined if parsing fails
     */
    public parseValue(value: string): Amount | undefined {
        return Utils.parseValue(value, this.getDecimalSeparator());
    }

    /**
     * Rounds a value according to the number of fraction digits of the Book.
     *
     * @param value - The value to be rounded
     *
     * @returns The rounded value
     */
    public round(value: Amount | number): Amount {
        return Utils.round(value, this.getFractionDigits());
    }

    /**
     * Batch create [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be created
     *
     * @returns The created Transactions
     */
    public async batchCreateTransactions(transactions: Transaction[]): Promise<Transaction[]> {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.json()));
        transactionPayloads = await TransactionService.createTransactionsBatch(
            this.getId(),
            transactionPayloads,
            this.getConfig()
        );
        transactions = transactionPayloads.map(tx => new Transaction(this, tx));
        return transactions;
    }

    /**
     * Batch post [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be posted
     */
    public async batchPostTransactions(transactions: Transaction[]): Promise<void> {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.json()));
        await TransactionService.postTransactionsBatch(
            this.getId(),
            transactionPayloads,
            this.getConfig()
        );
    }

    /**
     * Batch update [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be updated
     *
     * @param updateChecked - True to also update checked transactions
     *
     * @returns The updated draft Transactions
     */
    public async batchUpdateTransactions(
        transactions: Transaction[],
        updateChecked?: boolean
    ): Promise<Transaction[]> {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.json()));
        transactionPayloads = await TransactionService.updateTransactionsBatch(
            this.getId(),
            transactionPayloads,
            updateChecked,
            this.getConfig()
        );
        transactions = transactionPayloads.map(tx => new Transaction(this, tx));
        return transactions;
    }

    /**
     * Batch check [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be checked
     */
    public async batchCheckTransactions(transactions: Transaction[]): Promise<void> {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.json()));
        await TransactionService.checkTransactionsBatch(
            this.getId(),
            transactionPayloads,
            this.getConfig()
        );
    }

    /**
     * Batch uncheck [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be unchecked
     */
    public async batchUncheckTransactions(transactions: Transaction[]): Promise<void> {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.json()));
        await TransactionService.uncheckTransactionsBatch(
            this.getId(),
            transactionPayloads,
            this.getConfig()
        );
    }

    /**
     * Batch trash [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be trashed
     * @param trashChecked - True to also trash checked transactions
     */
    public async batchTrashTransactions(
        transactions: Transaction[],
        trashChecked?: boolean
    ): Promise<void> {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.json()));
        await TransactionService.trashTransactionsBatch(
            this.getId(),
            transactionPayloads,
            trashChecked,
            this.getConfig()
        );
    }

    /**
     * Batch untrash [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be untrashed
     */
    public async batchUntrashTransactions(transactions: Transaction[]): Promise<void> {
        let transactionPayloads: bkper.Transaction[] = [];
        transactions.forEach(tx => transactionPayloads.push(tx.json()));
        await TransactionService.untrashTransactionsBatch(
            this.getId(),
            transactionPayloads,
            this.getConfig()
        );
    }

    /**
     * Replay [[Events]] on the Book, in batch.
     *
     * @param events - The events to be replayed
     * @param errorOnly - True to only replay events with errors
     */
    public async batchReplayEvents(events: Event[], errorOnly?: boolean): Promise<void> {
        const eventIds = events.map(event => event.getId());
        const eventPayloads: bkper.Event[] = eventIds.map(id => ({ id: id }));
        const eventList: bkper.EventList = { items: eventPayloads };
        await EventService.replayEventsBatch(this, eventList, errorOnly, this.getConfig());
    }

    /**
     * Create [[Accounts]] on the Book, in batch.
     *
     * @param accounts - The accounts to be created
     *
     * @returns The created Accounts
     */
    public async batchCreateAccounts(accounts: Account[]): Promise<Account[]> {
        if (accounts.length > 0) {
            const accountList: bkper.AccountList = {
                items: accounts.map(a => a.json()),
            };
            const payloads = await AccountService.createAccounts(
                this.getId(),
                accountList,
                this.getConfig()
            );
            const createdAccounts: Account[] = [];
            for (const payload of payloads) {
                const account = new Account(this, payload);
                createdAccounts.push(account);
                this.setAccount(payload);
            }
            this.clearCache();
            return createdAccounts;
        }
        return [];
    }

    /**
     * Create [[Groups]] on the Book, in batch.
     *
     * @param groups - The groups to be created
     *
     * @returns The created Groups
     */
    public async batchCreateGroups(groups: Group[]): Promise<Group[]> {
        if (groups.length > 0) {
            const groupList: bkper.GroupList = { items: groups.map(g => g.json()) };
            const payloads = await GroupService.createGroups(
                this.getId(),
                groupList,
                this.getConfig()
            );
            const createdGroups: Group[] = [];
            for (const payload of payloads) {
                const group = new Group(this, payload);
                createdGroups.push(group);
                this.setGroup(payload);
            }
            this.clearCache();
            return createdGroups;
        }
        return [];
    }

    /**
     * Trigger [Balances Audit](https://help.bkper.com/en/articles/4412038-balances-audit) async process.
     */
    public audit(): void {
        BookService.audit(this.getId(), this.getConfig());
    }

    /**
     * Retrieve installed [[Apps]] for this Book.
     *
     * @returns The retrieved Apps objects
     */
    public async getApps(): Promise<App[]> {
        if (this.apps != null) {
            return this.apps;
        }
        const appsPlain = await BookService.getApps(this.getId(), this.getConfig());
        this.apps = appsPlain.map(a => new App(a, this.config));
        return this.apps;
    }

    /**
     * Gets the existing [[Integrations]] in the Book.
     *
     * @returns The retrieved Integration objects
     */
    public async getIntegrations(): Promise<Integration[]> {
        const integrationsPlain = await IntegrationService.listIntegrations(
            this.getId(),
            this.getConfig()
        );
        const integrations = integrationsPlain.map(i => new Integration(i, this.config));
        return integrations;
    }

    /**
     * Creates a new [[Integration]] in the Book.
     *
     * @param integration - The [[Integration]] object or wrapped plain json
     *
     * @returns The created [[Integration]] object
     */
    public async createIntegration(
        integration: bkper.Integration | Integration
    ): Promise<Integration> {
        if (integration instanceof Integration) {
            integration = await IntegrationService.createIntegration(
                this.getId(),
                integration.json(),
                this.getConfig()
            );
        } else {
            integration = await IntegrationService.createIntegration(
                this.getId(),
                integration,
                this.getConfig()
            );
        }
        return new Integration(integration, this.config);
    }

    /**
     * Updates an existing [[Integration]] in the Book.
     *
     * @param integration - The [[Integration]] wrapped plain json
     *
     * @returns The updated [[Integration]] object
     */
    public async updateIntegration(integration: bkper.Integration): Promise<Integration> {
        if (integration instanceof Integration) {
            integration = await IntegrationService.updateIntegration(
                this.getId(),
                integration.json(),
                this.getConfig()
            );
        } else {
            integration = await IntegrationService.updateIntegration(
                this.getId(),
                integration,
                this.getConfig()
            );
        }
        return new Integration(integration, this.config);
    }

    /**
     * Gets an [[Account]] object by id or name.
     *
     * Results are cached to avoid repeated server calls. Account-group relationships
     * are included if the full chart was loaded via getAccounts() or when the Book
     * was loaded with includeAccounts=true.
     *
     * @param idOrName - The id or name of the Account
     *
     * @returns The matching Account object
     *
     * @example
     * ```typescript
     * // Get individual account (basic data, cached)
     * const account = await book.getAccount('Bank Account');
     *
     * // For account-group relationships, use one of these approaches:
     * // Option 1: Load book with full data upfront
     * const bookWithAccounts = await Bkper.getBook(bookId, true);
     * const accountWithGroups = await bookWithAccounts.getAccount('Bank Account');
     *
     * // Option 2: Load full chart when needed
     * await book.getAccounts();
     * const accountWithGroups2 = await book.getAccount('Bank Account');
     * ```
     */
    public async getAccount(idOrName?: string): Promise<Account | undefined> {
        if (!idOrName || idOrName.trim() == '') {
            return undefined;
        }

        let account: Account | undefined;

        // Try to get account by id
        if (this.idAccountMap) {
            account = this.idAccountMap.get(idOrName);
        }
        // Try to get account by name
        if (!account && this.nameAccountMap) {
            account = this.nameAccountMap.get(Utils.normalizeName(idOrName));
        }
        // Try to fetch account from server
        if (!account) {
            const accountPayload = await AccountService.getAccount(
                this.getId(),
                idOrName,
                this.getConfig()
            );
            if (accountPayload) {
                account = new Account(this, accountPayload);
                this.updateAccountCache(account);
            }
        }

        return account;
    }

    /** @internal */
    private updateGroupCache(group: Group): void {
        this.updateGroupIdMap(group);
        this.updateGroupNameMap(group);
    }

    /** @internal */
    private updateGroupIdMap(group: Group): void {
        this.idGroupMap = this.idGroupMap || new Map<string, Group>();
        const id = group.getId();
        if (id) {
            this.idGroupMap.set(id, group);
        }
    }

    /** @internal */
    private updateGroupNameMap(group: Group): void {
        this.nameGroupMap = this.nameGroupMap || new Map<string, Group>();
        const normalizedName = group.getNormalizedName();
        if (normalizedName) {
            this.nameGroupMap.set(normalizedName, group);
        }
    }

    /** @internal */
    private updateAccountCache(account: Account): void {
        this.updateAccountIdMap(account);
        this.updateAccountNameMap(account);
    }

    /** @internal */
    private updateAccountIdMap(account: Account): void {
        this.idAccountMap = this.idAccountMap || new Map<string, Account>();
        const id = account.getId();
        if (id) {
            this.idAccountMap.set(id, account);
        }
    }

    /** @internal */
    private updateAccountNameMap(account: Account): void {
        this.nameAccountMap = this.nameAccountMap || new Map<string, Account>();
        const normalizedName = account.getNormalizedName();
        if (normalizedName) {
            this.nameAccountMap.set(normalizedName, account);
        }
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
     * Gets a [[Group]] object by id or name.
     *
     * Results are cached to avoid repeated server calls. Parent/child relationships
     * are included if all groups were loaded via getGroups() or when the Book was
     * loaded with includeGroups=true.
     *
     * @param idOrName - The id or name of the Group
     *
     * @returns The matching Group object
     *
     * @example
     * ```typescript
     * // Get individual group (basic data, cached)
     * const group = await book.getGroup('Assets');
     *
     * // For parent/child relationships, use one of these approaches:
     * // Option 1: Load book with full hierarchy upfront
     * const bookWithGroups = await Bkper.getBook(bookId, false, true);
     * const groupWithTree = await bookWithGroups.getGroup('Assets');
     *
     * // Option 2: Load full hierarchy when needed
     * await book.getGroups();
     * const groupWithTree2 = await book.getGroup('Assets');
     * console.log(groupWithTree2.getParent(), groupWithTree2.getChildren());
     * ```
     */
    public async getGroup(idOrName?: string): Promise<Group | undefined> {
        if (!idOrName || idOrName.trim() == '') {
            return undefined;
        }

        let group: Group | undefined;

        // Try to get group by id
        if (this.idGroupMap) {
            group = this.idGroupMap.get(idOrName);
        }
        // Try to get group by name
        if (!group && this.nameGroupMap) {
            group = this.nameGroupMap.get(Utils.normalizeName(idOrName));
        }
        // Try to fetch group from server
        if (!group) {
            const groupPayload = await GroupService.getGroup(
                this.getId(),
                idOrName,
                this.getConfig()
            );
            if (groupPayload) {
                group = new Group(this, groupPayload);
                this.updateGroupCache(group);
            }
        }

        return group;
    }

    /**
     * Gets all [[Groups]] of this Book with complete parent/child hierarchy.
     *
     * Results are cached for performance. Group tree relationships are built
     * during loading. Consider using Bkper.getBook(id, false, true) for
     * upfront loading when you know you'll need all groups.
     *
     * @returns The retrieved [[Group]] objects
     *
     * @example
     * ```typescript
     * // Load all groups with complete hierarchy
     * const groups = await book.getGroups();
     *
     * // Alternative: Load book with groups upfront (more efficient)
     * const bookWithGroups = await Bkper.getBook(bookId, false, true);
     * const groups2 = await bookWithGroups.getGroups(); // Already cached
     * ```
     */
    public async getGroups(): Promise<Group[]> {
        if (this.idGroupMap && this.allGroupsLoaded) {
            return Array.from(this.idGroupMap?.values() || []);
        }
        let groups = await GroupService.getGroups(this.getId(), this.getConfig());
        this.allGroupsLoaded = this.mapGroups(groups);
        return Array.from(this.idGroupMap?.values() || []);
    }

    /** @internal */
    private mapGroups(groups?: bkper.Group[]): boolean {
        if (!groups) {
            return false;
        }
        let groupsObj = groups.map(group => new Group(this, group));
        this.idGroupMap = new Map<string, Group>();
        this.nameGroupMap = new Map<string, Group>();
        for (const group of groupsObj) {
            this.updateGroupCache(group);
            group.buildGroupTree(this.idGroupMap);
        }
        for (const group of groupsObj) {
            group.buildGroupTree(this.idGroupMap);
        }
        return true;
    }

    /**
     * Gets all [[Accounts]] of this Book with full account-group relationships.
     *
     * Results are cached for performance. Groups are automatically loaded first
     * to ensure proper linking. Consider using Bkper.getBook(id, true) for
     * upfront loading when you know you'll need all accounts.
     *
     * @returns The retrieved [[Account]] objects
     *
     * @example
     * ```typescript
     * // Load all accounts with complete relationships
     * const accounts = await book.getAccounts();
     *
     * // Alternative: Load book with accounts upfront (more efficient)
     * const bookWithAccounts = await Bkper.getBook(bookId, true);
     * const accounts2 = await bookWithAccounts.getAccounts(); // Already cached
     * ```
     */
    public async getAccounts(): Promise<Account[]> {
        if (this.idAccountMap && this.allAccountsLoaded) {
            return Array.from(this.idAccountMap?.values() || []);
        }

        //Ensure groups are loaded
        await this.getGroups();

        let accounts = await AccountService.getAccounts(this.getId(), this.getConfig());
        this.allAccountsLoaded = this.mapAccounts(accounts);
        return Array.from(this.idAccountMap?.values() || []);
    }

    /** @internal */
    private mapAccounts(accounts?: bkper.Account[]): boolean {
        if (!accounts) {
            return false;
        }
        let accountsObj = accounts.map(account => new Account(this, account));
        this.idAccountMap = new Map<string, Account>();
        this.nameAccountMap = new Map<string, Account>();
        for (const account of accountsObj) {
            this.updateAccountCache(account);
            this.linkAccountsAndGroups(account);
        }

        this.ensureGroupsAccountMapsLoaded();
        return true;
    }

    /** @internal */
    private linkAccountsAndGroups(account: Account) {
        const groupPayloads = account.json().groups || [];
        for (const groupPayload of groupPayloads) {
            const group = this.idGroupMap?.get(groupPayload.id || '');
            if (group != null) {
                group.addAccount(account);
            }
        }
    }

    /** @internal */
    private ensureGroupsAccountMapsLoaded(): void {
        if (this.idGroupMap && !this.allGroupsLoaded) {
            for (const group of this.idGroupMap.values()) {
                if (group.accounts == null) {
                    group.accounts = new Map<string, Account>();
                }
            }
        }
    }

    /** @internal */
    clearCache(): void {
        this.clearGroupCache();
        this.clearAccountCache();
    }

    /** @internal */
    private clearGroupCache(): void {
        this.allGroupsLoaded = false;
        this.idGroupMap = undefined;
        this.nameGroupMap = undefined;
    }

    /** @internal */
    private clearAccountCache(): void {
        this.allAccountsLoaded = false;
        this.idAccountMap = undefined;
        this.nameAccountMap = undefined;
    }

    /** @internal */
    clearCollaboratorCache(): void {
        this.collaborators = undefined;
    }

    /** @internal */
    setAccount(account: bkper.Account, remove?: boolean): void {
        const accountPayloads = this.payload.accounts || [];
        if (remove) {
            this.payload.accounts = accountPayloads.filter(a => a.id !== account.id);
        } else {
            const existingAccount = accountPayloads.find(a => a.id === account.id);
            if (existingAccount) {
                this.payload.accounts = accountPayloads.map(a =>
                    a.id === account.id ? account : a
                );
            } else {
                this.payload.accounts = [...accountPayloads, account];
            }
        }
    }

    /** @internal */
    setGroup(group: bkper.Group, remove?: boolean): void {
        const groupPayloads = this.payload.groups || [];
        if (remove) {
            this.payload.groups = groupPayloads.filter(g => g.id !== group.id);
        } else {
            const existingGroup = groupPayloads.find(g => g.id === group.id);
            if (existingGroup) {
                this.payload.groups = groupPayloads.map(g => (g.id === group.id ? group : g));
            } else {
                this.payload.groups = [...groupPayloads, group];
            }
        }
    }

    /**
     * Lists transactions in the Book based on the provided query, limit, and cursor, for pagination.
     *
     * @param query - The query string to filter transactions
     * @param limit - The maximum number of transactions to return. Default to 100, max to 1000
     * @param cursor - The cursor for pagination
     *
     * @returns A [[TransactionList]] object containing the list of transactions
     */
    public async listTransactions(
        query?: string,
        limit?: number,
        cursor?: string
    ): Promise<TransactionList> {
        const transactionsList = await TransactionService.listTransactions(
            this.getId(),
            query,
            limit,
            cursor,
            this.getConfig()
        );
        return new TransactionList(this, transactionsList);
    }

    /**
     * Retrieve the number of transactions based on a query.
     *
     * @param query - The query string
     *
     * @returns The number of matching transactions
     */
    public async countTransactions(query?: string): Promise<number | undefined> {
        const count = await TransactionService.countTransactions(
            this.getId(),
            query,
            this.getConfig()
        );
        return count.total;
    }

    /**
     * Lists events in the Book based on the provided parameters.
     *
     * @param afterDate - The start date (inclusive) for the events search range, in [RFC3339](https://en.wikipedia.org/wiki/ISO_8601#RFC_3339) format. Can be null
     * @param beforeDate - The end date (exclusive) for the events search range, in [RFC3339](https://en.wikipedia.org/wiki/ISO_8601#RFC_3339) format. Can be null
     * @param onError - True to search only for events on error
     * @param resourceId - The ID of the event's resource (Transaction, Account, or Group). Can be null
     * @param limit - The maximum number of events to return
     * @param cursor - The cursor for pagination. Can be null
     *
     * @returns An [[EventList]] object containing the list of events
     */
    public async listEvents(
        afterDate: string | null,
        beforeDate: string | null,
        onError: boolean,
        resourceId: string | null,
        limit: number,
        cursor?: string
    ): Promise<EventList> {
        const eventsList = await EventService.listEvents(
            this,
            afterDate,
            beforeDate,
            onError,
            resourceId,
            limit,
            cursor,
            this.getConfig()
        );
        return new EventList(this, eventsList);
    }

    /**
     * Retrieve a transaction by id.
     *
     * @param id - The transaction ID
     *
     * @returns The [[Transaction]] object
     */
    public async getTransaction(id: string): Promise<Transaction | undefined> {
        let wrapped = await TransactionService.getTransaction(this.getId(), id, this.getConfig());
        if (!wrapped) {
            return undefined;
        }
        let transaction = new Transaction(this, wrapped);
        return transaction;
    }

    /**
     * Retrieve a file by id.
     *
     * @param id - The file ID
     *
     * @returns The [[File]] object
     */
    public async getFile(id: string): Promise<File | undefined> {
        let wrapped = await FileService.getFile(this.getId(), id, this.getConfig());
        if (!wrapped) {
            return undefined;
        }
        let file = new File(this, wrapped);
        return file;
    }

    /**
     * Performs create new Book.
     *
     * @returns The created Book object
     */
    public async create(): Promise<Book> {
        this.payload = await BookService.createBook(this.payload, this.getConfig());
        return this;
    }

    /**
     * Creates a copy of this Book
     *
     * @param name - The name for the copied book
     * @param copyTransactions - True to copy transactions from the source book (user must be the Book owner)
     * @param fromDate - Start date to consider if copying transactions (numeric value in YYYYMMDD format)
     *
     * @returns The copied Book object
     */
    public async copy(name: string, copyTransactions?: boolean, fromDate?: number): Promise<Book> {
        const copiedBookPayload = await BookService.copyBook(
            this.getId(),
            name,
            copyTransactions,
            fromDate,
            this.getConfig()
        );
        return new Book(copiedBookPayload, this.config);
    }

    /**
     * Perform update Book, applying pending changes.
     *
     * @returns The updated Book object
     */
    public async update(): Promise<Book> {
        this.payload = await BookService.updateBook(this.getId(), this.payload, this.getConfig());
        return this;
    }

    /**
     * Warning!
     *
     * Deletes this Book and all its data (transactions, accounts, groups). Book owner only.
     *
     * @returns This Book after deletion
     */
    public async remove(): Promise<Book> {
        this.payload = await BookService.deleteBook(this.getId(), this.getConfig());
        return this;
    }

    /**
     * Create a [[BalancesReport]] based on query.
     *
     * @param query - The balances report query
     *
     * @returns The balances report
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
     *
     * @returns The retrieved [[BalancesReport]] object
     */
    public async getBalancesReport(query: string): Promise<BalancesReport> {
        const balances = await BalancesService.getBalances(this.getId(), query, this.getConfig());
        return new BalancesReport(this, balances);
    }

    /**
     * Gets the saved queries from this book.
     *
     * @returns The saved queries from this book
     */
    public async getSavedQueries(): Promise<Query[]> {
        if (this.queries == null) {
            const queryPayloads = await QueryService.getSavedQueries(
                this.getId(),
                this.getConfig()
            );
            this.queries = queryPayloads.map(payload => new Query(this, payload));
        }
        return this.queries;
    }

    /**
     * Gets all collaborators of this Book.
     *
     * @returns Array of Collaborator objects
     */
    public async getCollaborators(): Promise<Collaborator[]> {
        if (!this.collaborators) {
            const collaboratorPayloads = await CollaboratorService.listCollaborators(
                this.getId(),
                this.getConfig()
            );
            this.collaborators = collaboratorPayloads.map(
                payload => new Collaborator(this, payload)
            );
        }
        return this.collaborators;
    }

    /**
     * Gets the Backlog of this Book.
     *
     * @returns The Backlog object
     */
    public async getBacklog(): Promise<Backlog> {
        const backlogPayload = await EventService.getBacklog(this, this.getConfig());
        return new Backlog(backlogPayload, this.config);
    }

    /**
     * Create a {@link AccountsDataTableBuilder}, to build two dimensional Array representations of {@link Account} dataset.
     *
     * @param accounts - Optional array of accounts. If not provided, all accounts will be fetched.
     *
     * @returns Accounts data table builder.
     */
    public async createAccountsDataTable(accounts?: Account[]): Promise<AccountsDataTableBuilder> {
        if (!accounts) {
            accounts = await this.getAccounts();
        }
        return new AccountsDataTableBuilder(accounts);
    }

    /**
     * Create a {@link GroupsDataTableBuilder}, to build two dimensional Array representations of {@link Group} dataset.
     *
     * @param groups - Optional array of groups. If not provided, all groups will be fetched.
     *
     * @returns Groups data table builder.
     */
    public async createGroupsDataTable(groups?: Group[]): Promise<GroupsDataTableBuilder> {
        if (!groups) {
            groups = await this.getGroups();
        }
        return new GroupsDataTableBuilder(groups);
    }

    /**
     * Create a {@link TransactionsDataTableBuilder}, to build two dimensional Array representations of {@link Transaction} dataset.
     *
     * @param transactions - Array of transactions to include in the table.
     * @param account - Optional account for balance column display.
     *
     * @returns Transactions data table builder.
     */
    public createTransactionsDataTable(
        transactions: Transaction[],
        account?: Account
    ): TransactionsDataTableBuilder {
        return new TransactionsDataTableBuilder(this, transactions, account);
    }
}
