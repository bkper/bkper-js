import { File } from './File.js';
import { Book } from './Book.js';
import { Account } from './Account.js';
import { Config } from './Config.js';
import { ResourceProperty } from './ResourceProperty.js';
import { TransactionStatus } from './Enums.js';
import * as TransactionService from '../service/transaction-service.js';
import * as Utils from '../utils.js';
import { Amount } from './Amount.js';
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * This class defines a Transaction between [credit and debit](http://en.wikipedia.org/wiki/Debits_and_credits) [[Accounts]].
 *
 * A Transaction is the main entity on the [Double Entry](http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) [Bookkeeping](http://en.wikipedia.org/wiki/Bookkeeping) system.
 *
 * @public
 */
export class Transaction extends ResourceProperty<bkper.Transaction> {
    /** @internal */
    private book: Book;

    /** @internal */
    private pendingFiles: Map<string, File> = new Map();

    constructor(book: Book, payload?: bkper.Transaction) {
        super(payload || { createdAt: `${Date.now()}` });
        this.book = book;
    }

    /** @internal */
    public getConfig(): Config {
        return this.book.getConfig();
    }

    /**
     * Gets the book associated with this transaction.
     *
     * @returns The book of the Transaction
     */
    public getBook(): Book {
        return this.book;
    }

    /**
     * Gets the unique identifier of the transaction.
     *
     * @returns The id of the Transaction
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the unique identifier of the agent that created this transaction.
     *
     * @returns The id of the agent that created this transaction
     */
    public getAgentId(): string | undefined {
        return this.payload.agentId;
    }

    /**
     * Gets the name of the agent that created this transaction.
     *
     * @returns The name of the agent that created this transaction
     */
    public getAgentName(): string | undefined {
        return this.payload.agentName;
    }

    /**
     * Gets the logo URL of the agent that created this transaction.
     *
     * @returns The logo of the agent that created this transaction
     */
    public getAgentLogoUrl(): string | undefined {
        return this.payload.agentLogo;
    }

    /**
     * Gets the dark mode logo URL of the agent that created this transaction.
     *
     * @returns The logo of the agent that created this transaction in dark mode
     */
    public getAgentLogoUrlDark(): string | undefined {
        return this.payload.agentLogoDark;
    }

    /**
     * Gets the remote IDs associated with this transaction. Remote ids are used to avoid duplication.
     *
     * @returns The remote ids of the Transaction
     */
    public getRemoteIds(): string[] {
        return this.payload.remoteIds || [];
    }

    /**
     * Add a remote id to the Transaction.
     *
     * @param remoteId - The remote id to add
     *
     * @returns This Transaction, for chaining
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
     * Checks if the transaction has been posted to the accounts.
     *
     * @returns True if transaction was already posted to the accounts. False if is still a Draft
     */
    public isPosted(): boolean | undefined {
        return this.payload.posted;
    }

    /**
     * Checks if the transaction is marked as checked.
     *
     * @returns True if transaction is checked
     */
    public isChecked(): boolean | undefined {
        return this.payload.checked;
    }

    /**
     * Set the check state of the Transaction.
     *
     * @param checked - The check state
     *
     * @returns This Transaction, for chaining
     */
    public setChecked(checked: boolean): Transaction {
        this.payload.checked = checked;
        return this;
    }

    /**
     * Checks if the transaction is in the trash.
     *
     * @returns True if transaction is in trash
     */
    public isTrashed(): boolean | undefined {
        return this.payload.trashed;
    }

    /**
     * Checks if the transaction is locked by the book's lock or closing date.
     *
     * @returns True if a transaction is locked by the book lock/closing date
     */
    public isLocked(): boolean {
        const date = this.getDate() || Utils.formatDateISO(new Date(), this.book.getTimeZone());
        const lockOrClosingDate = this.book.getMostRecentLockDate_();
        return (
            lockOrClosingDate != null &&
            Utils.getIsoDateValue(lockOrClosingDate) >= Utils.getIsoDateValue(date)
        );
    }

    /**
     * Gets the status of the transaction.
     *
     * @returns The status of the Transaction
     */
    public getStatus(): TransactionStatus {
        if (this.isTrashed()) {
            return TransactionStatus.TRASHED;
        }
        if (!this.isPosted()) {
            return TransactionStatus.DRAFT;
        }
        if (this.isChecked()) {
            return TransactionStatus.CHECKED;
        }
        return TransactionStatus.UNCHECKED;
    }

    /**
     * Gets all hashtags used in the transaction.
     *
     * @returns All #hashtags used on the transaction
     */
    public getTags(): string[] {
        if (this.payload.tags && this.payload.tags.length > 0) {
            return this.payload.tags;
        }

        const description = this.getDescription();
        if (description && description.includes('#')) {
            return Utils.extractTagsFromText(description);
        }

        return [];
    }

    /**
     * Gets all URLs associated with the transaction.
     *
     * @returns All urls of the transaction
     */
    public getUrls(): string[] {
        return this.payload.urls || [];
    }

    /**
     * Sets the Transaction urls. Url starts with https://
     *
     * @param urls - The urls array
     *
     * @returns This Transaction, for chaining
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
     * @param url - The url to add
     *
     * @returns This Transaction, for chaining
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
     * Gets all files attached to the transaction.
     *
     * @returns The files attached to the transaction
     */
    public getFiles(): File[] {
        if (this.payload.files && this.payload.files.length > 0) {
            const files = this.payload.files.map(file => new File(this.book, file));
            return files;
        } else {
            return [];
        }
    }

    /**
     * Removes a file attachment from the Transaction.
     *
     * @param file - The File to remove from this Transaction
     *
     * @returns This Transaction, for chaining
     */
    public removeFile(file: File): Transaction {
        const fileId = file.getId();
        if (fileId) {
            if (this.payload.files != null) {
                this.payload.files = this.payload.files.filter(f => f.id !== fileId);
            }
            this.pendingFiles.delete(fileId);
        }
        return this;
    }

    /**
     * Adds a file attachment to the Transaction.
     *
     * Files not previously created in the Book will be automatically created when the transaction is persisted.
     *
     * @param file - The File to add to this Transaction
     *
     * @returns This Transaction, for chaining
     */
    public addFile(file: File): Transaction {
        if (this.payload.files == null) {
            this.payload.files = [];
        }

        // Store file reference for later creation if needed
        const fileId = file.getId();
        const fileBookId = file.getBook()?.getId();
        if (fileId == null || fileBookId != this.book.getId()) {
            // Generate temporary ID if file doesn't have one
            if (fileId == null) {
                file.payload.id = `temporary_${uuidv4()}`;
            }
            this.pendingFiles.set(file.getId()!, file);
        }

        this.payload.files.push(file.json());
        return this;
    }

    /** @internal */
    private async createPendingFiles(): Promise<void> {
        if (this.pendingFiles.size === 0) {
            return;
        }

        if (this.payload.files == null) {
            this.payload.files = [];
        }

        // Create all pending files in parallel
        const promises = Array.from(this.pendingFiles.entries()).map(async ([fileId, file]) => {
            file.book = this.book;
            file.setProperty('upload_method', 'attachment');
            const createdFile = await file.create();
            return { fileId, createdFile };
        });

        const results = await Promise.all(promises);

        // Update payload with all created files
        for (const { fileId, createdFile } of results) {
            const fileIndex = this.payload.files.findIndex(f => f.id === fileId);
            if (fileIndex >= 0) {
                this.payload.files[fileIndex] = createdFile.json();
            } else {
                this.payload.files.push(createdFile.json());
            }
        }

        // Clear pending files after creation
        this.pendingFiles.clear();
    }

    /**
     * Check if the transaction has the specified tag.
     *
     * @param tag - The tag to check for
     *
     * @returns True if the transaction has the specified tag
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
     * Gets the credit account associated with this Transaction. Same as origin account
     *
     * @returns The credit (origin) account
     */
    public async getCreditAccount(): Promise<Account | undefined> {
        if (!this.payload.creditAccount) {
            return undefined;
        }
        return await this.book.getAccount(this.payload.creditAccount.id);
    }

    /**
     * Gets the name of this Transaction's credit account.
     *
     * @returns The credit account name
     */
    public async getCreditAccountName(): Promise<string | undefined> {
        if ((await this.getCreditAccount()) != null) {
            return (await this.getCreditAccount())?.getName();
        } else {
            return '';
        }
    }

    /**
     * Sets the credit/origin [[Account]] of this Transaction. Same as from()
     *
     * @param account - The Account object, or null/undefined to clear
     *
     * @returns This Transaction, for chaining
     */
    public setCreditAccount(account: Account | bkper.Account | null | undefined): Transaction {
        if (account == null) {
            this.payload.creditAccount = undefined;
            return this;
        }

        if (account instanceof Account) {
            if (account.getId() != null) {
                this.payload.creditAccount = account.json();
            }
        } else {
            if (account.id != null) {
                this.payload.creditAccount = account;
            }
        }
        return this;
    }

    /**
     * Sets the credit/origin [[Account]] of this Transaction. Same as setCreditAccount()
     *
     * @param account - The Account object, or null/undefined to clear
     *
     * @returns This Transaction, for chaining
     */
    public from(account: Account | bkper.Account | null | undefined): Transaction {
        return this.setCreditAccount(account);
    }

    /**
     * Gets the debit account associated with this Transaction. Same as destination account
     *
     * @returns The debit (destination) account
     */
    public async getDebitAccount(): Promise<Account | undefined> {
        if (!this.payload.debitAccount) {
            return undefined;
        }
        return await this.book.getAccount(this.payload.debitAccount.id);
    }

    /**
     * Gets the name of this Transaction's debit account.
     *
     * @returns The debit account name
     */
    public async getDebitAccountName(): Promise<string | undefined> {
        if ((await this.getDebitAccount()) != null) {
            return (await this.getDebitAccount())?.getName();
        } else {
            return '';
        }
    }

    /**
     * Sets the debit/destination [[Account]] of this Transaction. Same as to()
     *
     * @param account - The Account object, or null/undefined to clear
     *
     * @returns This Transaction, for chaining
     */
    public setDebitAccount(account: Account | bkper.Account | null | undefined): Transaction {
        if (account == null) {
            this.payload.debitAccount = undefined;
            return this;
        }

        if (account instanceof Account) {
            if (account.getId() != null) {
                this.payload.debitAccount = { id: account.getId(), name: account.getName() };
            }
        } else {
            if (account.id != null) {
                this.payload.debitAccount = { id: account.id, name: account.name };
            }
        }
        return this;
    }

    /**
     * Sets the debit/destination [[Account]] of this Transaction. Same as setDebitAccount()
     *
     * @param account - The Account object, or null/undefined to clear
     *
     * @returns This Transaction, for chaining
     */
    public to(account: Account | bkper.Account | null | undefined): Transaction {
        return this.setDebitAccount(account);
    }

    /**
     * Gets the amount of this Transaction.
     *
     * @returns The amount of this Transaction
     */
    public getAmount(): Amount | undefined {
        return this.payload.amount != null && this.payload.amount.trim() != ''
            ? new Amount(this.payload.amount)
            : undefined;
    }

    /**
     * Gets the formatted amount of this Transaction according to the Book format.
     *
     * @returns The amount of this Transaction, formatted according to the Book format
     */
    public getAmountFormatted(): string | undefined {
        const amount = this.getAmount();
        if (amount) {
            return this.book.formatValue(amount);
        }
        return undefined;
    }

    /**
     * Sets the amount of this Transaction.
     *
     * @param amount - The amount to set
     *
     * @returns This Transaction, for chaining
     */
    public setAmount(amount: Amount | number | string): Transaction {
        if (typeof amount == 'string') {
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
     * Get the absolute amount of this Transaction if the given account is at the credit side.
     *
     * @param account - The account object, id or name
     *
     * @returns The credit amount or undefined
     */
    public async getCreditAmount(account: Account | string): Promise<Amount | undefined> {
        let accountObject = await this.getAccount_(account);
        if (await this.isCredit(accountObject)) {
            return this.getAmount();
        }
        return undefined;
    }

    /**
     * Gets the absolute amount of this Transaction if the given account is at the debit side.
     *
     * @param account - The account object, id or name
     *
     * @returns The debit amount or undefined
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
     * @param account - The account object, id or name
     *
     * @returns The account at the other side of the transaction
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
     * The Account name at the other side of this Transaction given the one in one side.
     *
     * @param account - The Account object, id or name
     *
     * @returns The name of the Account at the other side
     */
    public async getOtherAccountName(account: string | Account): Promise<string | undefined> {
        var otherAccount = await this.getOtherAccount(account);
        if (otherAccount != null) {
            return otherAccount.getName();
        } else {
            return '';
        }
    }

    /**
     * Tell if the given account is credit on this Transaction
     *
     * @param account - The Account object
     *
     * @returns True if the account is the credit account
     */
    public async isCredit(account?: Account): Promise<boolean> {
        return (
            (await this.getCreditAccount()) != null &&
            account != null &&
            (await this.getCreditAccount())?.getNormalizedName() == account.getNormalizedName()
        );
    }

    /**
     * Tell if the given account is debit on the Transaction
     *
     * @param account - The [[Account]] object
     *
     * @returns True if the Account is the debit account
     */
    public async isDebit(account?: Account): Promise<boolean> {
        return (
            (await this.getDebitAccount()) != null &&
            account != null &&
            (await this.getDebitAccount())?.getNormalizedName() == account.getNormalizedName()
        );
    }

    /** @internal */
    private async getAccount_(account: Account | string): Promise<Account | undefined> {
        if (account == null || account instanceof Account) {
            return account as Account;
        }
        return await this.book.getAccount(account);
    }

    /**
     * Gets the description of this Transaction.
     *
     * @returns The description of this Transaction
     */
    public getDescription(): string {
        if (this.payload.description == null) {
            return '';
        }
        return this.payload.description;
    }

    /**
     * Sets the description of the Transaction.
     *
     * @param description - The description to set
     *
     * @returns This Transaction, for chaining
     */
    public setDescription(description: string): Transaction {
        this.payload.description = description;
        return this;
    }

    /**
     * Gets the transaction date in ISO format.
     *
     * @returns The Transaction date, in ISO format yyyy-MM-dd
     */
    public getDate(): string | undefined {
        return this.payload.date;
    }

    /**
     * Sets the date of the Transaction.
     *
     * @param date - The date to set as string or Date object
     *
     * @returns This Transaction, for chaining
     */
    public setDate(date: string | Date): Transaction {
        if (typeof date == 'string') {
            if (date.indexOf('/') > 0) {
                let dateObject = Utils.parseDate(
                    date,
                    this.book.getDatePattern(),
                    this.book.getTimeZone()
                );
                this.payload.date = Utils.formatDateISO(dateObject, this.book.getTimeZone());
            } else if (date.indexOf('-') >= 0) {
                this.payload.date = date;
            }
        } else if (Object.prototype.toString.call(date) === '[object Date]') {
            this.payload.date = Utils.formatDateISO(date, this.book.getTimeZone());
        }
        return this;
    }

    /**
     * Gets the transaction date as a Date object in the book's timezone.
     *
     * @returns The Transaction Date object, on the time zone of the [[Book]]
     */
    public getDateObject(): Date {
        return Utils.convertValueToDate(this.getDateValue(), this.book.getTimeZoneOffset());
    }

    /**
     * Gets the transaction date as a numeric value.
     *
     * @returns The Transaction date number, in format YYYYMMDD
     */
    public getDateValue(): number | undefined {
        return this.payload.dateValue;
    }

    /**
     * Gets the transaction date formatted according to the book's date pattern.
     *
     * @returns The Transaction date, formatted on the date pattern of the [[Book]]
     */
    public getDateFormatted(): string | undefined {
        return this.payload.dateFormatted;
    }

    /**
     * Gets the date when the transaction was created.
     *
     * @returns The date the transaction was created
     */
    public getCreatedAt(): Date {
        return new Date(new Number(this.payload.createdAt).valueOf());
    }

    /**
     * Gets the formatted creation date of the transaction.
     *
     * @returns The date the transaction was created, formatted according to the date pattern of the [[Book]]
     */
    public getCreatedAtFormatted(): string {
        return Utils.formatDate(
            this.getCreatedAt(),
            this.book.getDatePattern() + ' HH:mm:ss',
            this.book.getTimeZone()
        );
    }

    /**
     * Gets the username of the user who created the transaction.
     *
     * @returns The username of the user who created the transaction
     */
    public getCreatedBy(): string | undefined {
        return this.payload.createdBy;
    }

    /**
     * Gets the date when the transaction was last updated.
     *
     * @returns The date the transaction was last updated
     */
    public getUpdatedAt(): Date {
        return new Date(new Number(this.payload.updatedAt).valueOf());
    }

    /**
     * Gets the formatted last update date of the transaction.
     *
     * @returns The date the transaction was last updated, formatted according to the date pattern of the [[Book]]
     */
    public getUpdatedAtFormatted(): string {
        return Utils.formatDate(
            this.getUpdatedAt(),
            this.book.getDatePattern() + ' HH:mm:ss',
            this.book.getTimeZone()
        );
    }

    /** @internal */
    private getCaEvolvedBalance_(): Amount | undefined {
        return this.payload.creditAccount != null && this.payload.creditAccount.balance != null
            ? new Amount(this.payload.creditAccount.balance)
            : undefined;
    }

    /** @internal */
    private getDaEvolvedBalance_(): Amount | undefined {
        return this.payload.debitAccount != null && this.payload.debitAccount.balance != null
            ? new Amount(this.payload.debitAccount.balance)
            : undefined;
    }

    /**
     * Gets the balance that the [[Account]] has at that day, when listing transactions of that Account.
     *
     * Evolved balances is returned when searching for transactions of a permanent [[Account]].
     *
     * Only comes with the last posted transaction of the day.
     *
     * @param raw - True to get the raw balance, no matter the credit nature of the [[Account]]
     *
     * @returns The account balance at the transaction date
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
     *
     * @returns This Transaction, for chaining
     */
    public async create(): Promise<Transaction> {
        await this.createPendingFiles();
        let operation = await TransactionService.createTransaction(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.payload = operation.transaction || {};
        return this;
    }

    /**
     * Update transaction, applying pending changes.
     *
     * @returns This Transaction, for chaining
     */
    public async update(): Promise<Transaction> {
        await this.createPendingFiles();
        let operation = await TransactionService.updateTransaction(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.payload = operation.transaction || {};
        return this;
    }

    /**
     * Perform check transaction.
     *
     * @returns This Transaction, for chaining
     */
    public async check(): Promise<Transaction> {
        let operation = await TransactionService.checkTransaction(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.payload.checked = operation.transaction?.checked;
        return this;
    }

    /**
     * Perform uncheck transaction.
     *
     * @returns This Transaction, for chaining
     */
    public async uncheck(): Promise<Transaction> {
        let operation = await TransactionService.uncheckTransaction(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.payload.checked = operation.transaction?.checked;
        return this;
    }

    /**
     * Perform post transaction, changing credit and debit [[Account]] balances.
     *
     * @returns This Transaction, for chaining
     */
    public async post(): Promise<Transaction> {
        await this.createPendingFiles();
        let operation = await TransactionService.postTransaction(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.payload = operation.transaction || {};
        return this;
    }

    /**
     * Trash the transaction.
     *
     * @returns This Transaction, for chaining
     */
    public async trash(): Promise<Transaction> {
        let operation = await TransactionService.trashTransaction(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.payload.trashed = operation.transaction?.trashed;
        return this;
    }

    /**
     * Untrash the transaction.
     *
     * @returns This Transaction, for chaining
     */
    public async untrash(): Promise<Transaction> {
        let operation = await TransactionService.restoreTransaction(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.payload.trashed = operation.transaction?.trashed;
        return this;
    }
}
