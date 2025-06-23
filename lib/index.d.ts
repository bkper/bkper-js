/**
 * Bkper REST API Javascript client for Node.js and browsers.
 *
 * Learn more at https://bkper.com/docs
 *
 * @packageDocumentation
 */

/**
 *
 * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
 *
 * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transactions]].
 *
 * An Account can be grouped by [[Groups]].
 *
 * @public
 */
export declare class Account {
    payload: bkper.Account;

    constructor(book: Book, payload?: bkper.Account);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.Account;
    /**
     * Gets the account internal id.
     */
    getId(): string | undefined;
    /**
     * Gets the account name.
     */
    getName(): string | undefined;
    /**
     *
     * Sets the name of the Account.
     *
     * @returns This Account, for chainning.
     */
    setName(name: string): Account;
    /**
     * @returns The name of this account without spaces or special characters.
     */
    getNormalizedName(): string;
    /**
     * @returns The type for of this account.
     */
    getType(): AccountType;
    /**
     *
     * Sets the type of the Account.
     *
     * @returns This Account, for chainning
     */
    setType(type: AccountType): Account;
    /**
     * Gets the custom properties stored in this Account.
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     * Sets the custom properties of the Account
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This Account, for chainning.
     */
    setProperties(properties: {
        [key: string]: string;
    }): Account;
    /**
     * Gets the property value for given keys. First property found will be retrieved
     *
     * @param keys - The property key
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Sets a custom property in the Account.
     *
     * @param key - The property key
     * @param value - The property value
     *
     * @returns This Account, for chainning.
     */
    setProperty(key: string, value: string | null): Account;
    /**
     * Delete a custom property
     *
     * @param key - The property key
     *
     * @returns This Account, for chainning.
     */
    deleteProperty(key: string): Account;
    /**
     * Gets the balance based on credit nature of this Account.
     * @deprecated Use `Book.getBalancesReport` instead.
     * @returns The balance of this account.
     */
    getBalance(): Amount;
    /**
     * Gets the raw balance, no matter credit nature of this Account.
     * @deprecated Use `Book.getBalancesReport` instead.
     * @returns The balance of this account.
     */
    getBalanceRaw(): Amount;
    /**
     * Tell if this account is archived.
     */
    isArchived(): boolean | undefined;
    /**
     * Set account archived/unarchived.
     *
     * @returns This Account, for chainning.
     */
    setArchived(archived: boolean): Account;
    /**
     * Tell if the Account has any transaction already posted.
     *
     * Accounts with transaction posted, even with zero balance, can only be archived.
     */
    hasTransactionPosted(): boolean | undefined;
    /**
     *
     * Tell if the account is permanent.
     *
     * Permanent Accounts are the ones which final balance is relevant and keep its balances over time.
     *
     * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow)
     *
     * Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
     *
     * @returns True if its a permanent Account
     */
    isPermanent(): boolean | undefined;
    /**
     * Tell if the account has a Credit nature or Debit otherwise
     *
     * Credit accounts are just for representation purposes. It increase or decrease the absolute balance. It doesn't affect the overall balance or the behavior of the system.
     *
     * The absolute balance of credit accounts increase when it participate as a credit/origin in a transaction. Its usually for Accounts that increase the balance of the assets, like revenue accounts.
     *
     * ```
     *         Crediting a credit
     *   Thus ---------------------> account increases its absolute balance
     *         Debiting a debit
     *
     *
     *         Debiting a credit
     *   Thus ---------------------> account decreases its absolute balance
     *         Crediting a debit
     * ```
     *
     * As a rule of thumb, and for simple understanding, almost all accounts are Debit nature (NOT credit), except the ones that "offers" amount for the books, like revenue accounts.
     */
    isCredit(): boolean | undefined;
    /**
     * Get the [[Groups]] of this account.
     */
    getGroups(): Promise<Group[]>;
    /**
     * Sets the groups of the Account.
     *
     * @returns This Account, for chainning.
     */
    setGroups(groups: Group[] | bkper.Group[]): Account;
    /**
     * Add a group to the Account.
     *
     * @returns This Account, for chainning.
     */
    addGroup(group: Group | bkper.Group): Account;
    /**
     * Remove a group from the Account.
     */
    removeGroup(group: string | Group): Promise<Account>;
    /**
     * Tell if this account is in the [[Group]]
     *
     * @param  group - The Group name, id or object
     */
    isInGroup(group: string | Group): Promise<boolean>;

    /**
     * Perform create new account.
     */
    create(): Promise<Account>;
    /**
     * Perform update account, applying pending changes.
     */
    update(): Promise<Account>;
    /**
     * Perform delete account.
     */
    remove(): Promise<Account>;

}

/**
 * Enum that represents account types.
 *
 * @public
 */
export declare enum AccountType {
    /**
     * Asset account type
     */
    ASSET = "ASSET",
    /**
     * Liability account type
     */
    LIABILITY = "LIABILITY",
    /**
     * Incoming account type
     */
    INCOMING = "INCOMING",
    /**
     * Outgoing account type
     */
    OUTGOING = "OUTGOING"
}

/**
 * Defines an Agent on Bkper.
 *
 * An Agent represents an entity (such as an App or Bot) that interacts with Bkper, executing actions on behalf of users.
 *
 * @public
 */
export declare class Agent {
    payload: bkper.Agent;
    constructor(payload?: bkper.Agent);
    /**
     * @returns The wrapped plain json object
     */
    json(): bkper.Agent;
    /**
     *
     * @returns The Agent universal identifier
     */
    getId(): string | undefined;
    /**
     *
     * @returns The Agent name
     */
    getName(): string | undefined;
    /**
     *
     * @returns The Agent logo url
     */
    getLogoUrl(): string | undefined;
    /**
     *
     * @returns The Agent logo url in dark mode
     */
    getLogoUrlDark(): string | undefined;
}

/**
 * This class defines an Amount for arbitrary-precision decimal arithmetic.
 *
 * It inherits methods from [big.js](http://mikemcl.github.io/big.js/) library
 *
 * @public
 */
export declare class Amount {

    /**
     * The Amount constructor.
     */
    constructor(n: number | string | Amount);
    /**
     * Returns an absolute Amount.
     */
    abs(): Amount;
    /**
     * Compare
     */
    cmp(n: number | string | Amount): -1 | 0 | 1;
    /**
     * Divide by
     */
    div(n: number | string | Amount): Amount;
    /**
     * Equals to
     */
    eq(n: number | string | Amount): boolean;
    /**
     * Greater than
     */
    gt(n: number | string | Amount): boolean;
    /**
     * Greater than or equal
     */
    gte(n: number | string | Amount): boolean;
    /**
     * Less than
     */
    lt(n: number | string | Amount): boolean;
    /**
     * Less than or equal to
     */
    lte(n: number | string | Amount): boolean;
    /**
     * Sum
     */
    plus(n: number | string | Amount): Amount;
    /**
     * Minus
     */
    minus(n: number | string | Amount): Amount;
    /**
     * Modulo - the integer remainder of dividing this Amount by n.
     *
     * Similar to % operator
     *
     */
    mod(n: number | string | Amount): Amount;
    /**
     * Round to a maximum of dp decimal places.
     */
    round(dp?: number): Amount;
    /**
     * Multiply
     */
    times(n: number | string | Amount): Amount;
    /**
     * Returns a string representing the value of this Amount in normal notation to a fixed number of decimal places dp.
     */
    toFixed(dp?: number): string;
    /**
     * Returns a string representing the value of this Amount.
     */
    toString(): string;
    /**
     * Returns a primitive number representing the value of this Amount.
     */
    toNumber(): number;



}

/**
 * Defines an App on Bkper.
 *
 * Apps can be installed on Books by users.
 *
 * @public
 */
export declare class App {
    payload: bkper.App;
    constructor(payload?: bkper.App);
    /**
     * @returns The wrapped plain json object
     */
    json(): bkper.App;
    /**
     *
     * Sets the webhook url for development.
     *
     * @returns This App, for chainning.
     */
    setWebhookUrlDev(webhookUrlDev: string): App;
    /**
     *
     * Sets the conversation url for development.
     *
     * @returns This App, for chainning.
     */
    setConversationUrlDev(conversationUrlDev: string): App;
    /**
     *
     * @returns The App universal identifier
     */
    getId(): string | undefined;
    /**
     * @return The name of this App
     */
    getName(): string | undefined;
    /**
     * @return True if this App has events bound to it
     */
    hasEvents(): boolean;
    /**
     * @return The events bound to this App
     */
    getEvents(): EventType[] | undefined;
    /**
     * @return True if this App is published
     */
    isPublished(): boolean;
    /**
     * @return True if this App is conversational
     */
    isConversational(): boolean;
    /**
     * @return The logo url of this App
     */
    getLogoUrl(): string | undefined;
    /**
     * @return The logo url of this App in dark mode
     */
    getLogoUrlDark(): string | undefined;
    /**
     * @return The description of this App
     */
    getDescription(): string | undefined;
    /**
     * Sets the whitelabeled user emails
     *
     * @returns This App for chaining
     */
    setUserEmails(emails?: string): App;
    /**
     * @return The name of the owner of this App
     */
    getOwnerName(): string | undefined;
    /**
     * @return The menu url of this App
     */
    getMenuUrl(): string | undefined;
    /**
     * @return The menu development url of this App
     */
    getMenuUrlDev(): string | undefined;
    /**
     * @return The menu text of this App
     */
    getMenuText(): string | undefined;
    /**
     * @return The menu popup width of this App
     */
    getMenuPopupWidth(): string | undefined;
    /**
     * @return The menu popup height of this App
     */
    getMenuPopupHeight(): string | undefined;
    /**
     * @return The logo url of the owner of this App
     */
    getOwnerLogoUrl(): string | undefined;
    /**
     * @return The file patterns the App handles - E.g *.pdf *.csv
     */
    getFilePatterns(): string[] | undefined;
    /**
     * Sets the developer email
     *
     * @returns This App for chaining
     */
    setDeveloperEmail(email?: string): App;
    /**
     * Sets the client secret
     *
     * @returns This App for chaining
     */
    setClientSecret(clientSecret?: string): App;
    /**
     * Sets the readme text
     *
     * @returns This App for chaining
     */
    setReadme(readme?: string): App;
    /**
     * Performs the app creation, applying pending changes.
     *
     * The App id MUST be unique. If another app is already existing, an error will be thrown.
     */
    create(): Promise<App>;
    /**
     * Partially update an App, applying pending changes.
     */
    patch(): Promise<App>;
    /**
     * Perform update App, applying pending changes.
     */
    update(): Promise<App>;
}

/**
 * The container of balances of an [[Account]] or [[Group]]
 *
 * The container is composed of a list of [[Balances]] for a window of time, as well as its period and cumulative totals.
 *
 * @public
 */
export declare interface BalancesContainer {
    /**
     * @returns The parent BalancesReport of the container
     */
    getBalancesReport: () => BalancesReport;
    /**
     * @returns The [[Account]] or [[Group]] name
     */
    getName: () => string | undefined;
    /**
     * @returns The [[Account]] or [[Group]] name without spaces or special characters.
     */
    getNormalizedName: () => string | undefined;
    /**
     * @returns The [[Group]] associated with this container
     */
    getGroup: () => Promise<Group | null>;
    /**
     * @returns The [[Account]] associated with this container
     */
    getAccount: () => Promise<Account | null>;
    /**
     * @returns The parent BalanceContainer.
     */
    getParent: () => BalancesContainer | null;
    /**
     * @returns The depth in the parent chain up to the root.
     */
    getDepth: () => number;
    /**
     * @returns Gets the credit nature of the BalancesContainer, based on [[Account]] or [[Group]].
     *
     * For [[Account]], the credit nature will be the same as the one from the Account
     *
     * For [[Group]], the credit nature will be the same, if all accounts containing on it has the same credit nature. False if mixed.
     *
     */
    isCredit: () => boolean | undefined;
    /**
     *
     * Tell if this balance container is permament, based on the [[Account]] or [[Group]].
     *
     * Permanent are the ones which final balance is relevant and keep its balances over time.
     *
     * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow)
     *
     * Usually represents assets or liabilities, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
     *
     * @returns True if its a permanent Account
     */
    isPermanent: () => boolean | undefined;
    /**
     * @returns True if this balance container if from an [[Account]]
     */
    isFromAccount: () => boolean;
    /**
     * @returns True if this balance container if from a [[Group]]
     */
    isFromGroup: () => boolean;
    /**
     * @returns True if the balance container is from a parent group
     */
    hasGroupBalances: () => boolean;
    /**
     * @returns The cumulative balance to the date.
     */
    getCumulativeBalance: () => Amount;
    /**
     * @returns The cumulative raw balance to the date.
     */
    getCumulativeBalanceRaw: () => Amount;
    /**
     * @returns The cumulative balance formatted according to [[Book]] decimal format and fraction digits.
     */
    getCumulativeBalanceText: () => string;
    /**
     * @returns The cumulative raw balance formatted according to [[Book]] decimal format and fraction digits.
     */
    getCumulativeBalanceRawText: () => string;
    /**
     * @returns The balance on the date period.
     */
    getPeriodBalance: () => Amount;
    /**
     * @returns The raw balance on the date period.
     */
    getPeriodBalanceRaw: () => Amount;
    /**
     * @returns The balance on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodBalanceText: () => string;
    /**
     * @returns The raw balance on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodBalanceRawText: () => string;
    /**
     * @returns All child [[BalancesContainers]].
     *
     * **NOTE**: Only for Group balance containers. Accounts returns null.
     */
    getBalancesContainers: () => BalancesContainer[];
    /**
     * Gets a specific [[BalancesContainer]].
     *
     * @param name The [[Account]] or [[Group]] name.
     *
     * @returns The retrieved [[BalancesContainer]].
     */
    getBalancesContainer: (name: string) => BalancesContainer;
}

/**
 * Class representing a Balance Report, generated when calling [Book.getBalanceReport](#book_getbalancesreport)
 *
 * @public
 */
export declare class BalancesReport {
    payload: bkper.Balances;




    constructor(book: Book, payload: bkper.Balances);
    /**
     * @returns The [[Book]] that generated the report.
     */
    getBook(): Book;
    /**
     * @returns The [[Periodicity]] of the query used to generate the report.
     */
    getPeriodicity(): Periodicity;
    /**
     * @returns All [[BalancesContainers]] of the report.
     */
    getBalancesContainers(): BalancesContainer[];
    /**
     * Gets a specific [[BalancesContainer]].
     *
     * @param name The [[Account]] or [[Group]] name.
     *
     * @returns The retrieved [[BalancesContainer]].
     */
    getBalancesContainer(name: string): BalancesContainer;



}

/**
 * This is the main entry point of the [bkper-js](https://www.npmjs.com/package/bkper-js) library.
 *
 * You start by setting the API [[Config]] object.
 *
 * Example:
 *
 * ```javascript
 * Bkper.setConfig({
 *   apiKeyProvider: () => process.env.BKPER_API_KEY,
 *   oauthTokenProvider: () => process.env.BKPER_OAUTH_TOKEN
 * })
 * ```
 *
 * Once the config is set, you can start using the library.
 *
 * @public
 */
export declare class Bkper {
    /**
     * Gets the [[Book]] with the specified bookId from url param.
     *
     * @param id - The universal book id - The same bookId param of URL you access at app.bkper.com
     * @param includeAccounts - Optional parameter to include accounts in the retrieved Book
     *
     * @returns The retrieved Book, for chaining
     */
    static getBook(id: string, includeAccounts?: boolean): Promise<Book>;
    /**
     * Gets all [[Books]] the user has access to.
     *
     * @returns The retrieved list of Books
     */
    static getBooks(): Promise<Book[]>;
    /**
     * Gets all [[Collections]] the user has access to.
     *
     * @returns The retrieved list of Collections
     */
    static getCollections(): Promise<Collection[]>;
    /**
     * Gets all [[Apps]] available for the user.
     *
     * @returns The retrieved list of Apps
     */
    static getApps(): Promise<App[]>;
    /**
     * Gets all [[Conversations]] available for the user.
     *
     * @returns The retrieved list of Conversations
     */
    static getConversations(): Promise<Conversation[]>;
    /**
     * Gets all [[Templates]] available for the user.
     *
     * @returns The retrieved list of Templates
     */
    static getTemplates(): Promise<Template[]>;
    /**
     * Gets the current logged [[User]].
     *
     * @returns The retrieved User, for chaining
     */
    static getUser(): Promise<User>;
    /**
     * Gets the URL to redirect the User to the billing portal.
     *
     * @param returnUrl - The URL to return to after the User has been redirected to the billing portal
     *
     * @returns The URL to redirect the User to the billing portal
     */
    static getBillingPortalUrl(returnUrl: string): Promise<string | undefined>;
    /**
     * Sets the API [[Config]] object.
     *
     * @param config - The Config object
     */
    static setConfig(config: Config): void;
    /**
     * Sets the API key to identify the agent.
     *
     * @param key - The API key
     *
     * @returns The defined [[App]] object
     *
     * @deprecated Use `setConfig()` instead
     */
    static setApiKey(key: string): App;
    /**
     * Sets the provider of the valid OAuth2 access token
     *
     * @deprecated Use `setConfig()` instead
     */
    static setOAuthTokenProvider(oauthTokenProvider: () => Promise<string>): Promise<void>;
}

/**
 *
 * A Book represents [General Ledger](https://en.wikipedia.org/wiki/General_ledger) for a company or business, but can also represent a [Ledger](https://en.wikipedia.org/wiki/Ledger) for a project or department
 *
 * It contains all [[Accounts]] where [[Transactions]] are recorded/posted;
 *
 * @public
 */
export declare class Book {
    payload: bkper.Book;







    constructor(payload?: bkper.Book);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.Book;
    /**
     * Same as bookId param
     */
    getId(): string;
    /**
     * @returns The name of this Book
     */
    getName(): string | undefined;
    /**
     *
     * Sets the name of the Book.
     *
     * @returns This Book, for chainning.
     */
    setName(name: string): Book;
    /**
     * @returns The number of fraction digits supported by this Book. Same as getDecimalPlaces
     */
    getFractionDigits(): number | undefined;
    /**
     * @returns The number of decimal places supported by this Book. Same as getFractionDigits
     */
    getDecimalPlaces(): number | undefined;
    /**
     *
     * Sets the number of fraction digits (decimal places) supported by this Book
     *
     * @returns This Book, for chainning.
     */
    setFractionDigits(fractionDigits: number): Book;
    /**
     * @returns The period slice for balances visualization
     */
    getPeriod(): Period;
    /**
     * Sets the period slice for balances visualization
     *
     * @returns This Book, for chainning.
     */
    setPeriod(period: Period): Book;
    /**
     * @returns The start month when YEAR period set
     */
    getPeriodStartMonth(): Month;
    /**
     * Sets the start month when YEAR period set
     *
     * @returns This Book, for chainning.
     */
    setPeriodStartMonth(month: Month): Book;
    /**
     * @returns The transactions pagination page size
     */
    getPageSize(): number | undefined;
    /**
     * Sets the transactions pagination page size
     *
     * @returns This Book, for chainning.
     */
    setPageSize(pageSize: number): Book;
    /**
     * @returns The name of the owner of the Book
     */
    getOwnerName(): string | undefined;
    /**
     * @returns The permission for the current user
     */
    getPermission(): Permission;
    /**
     * @returns The collection of this book
     */
    getCollection(): Collection | undefined;
    /**
     * @returns The date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
     */
    getDatePattern(): string | undefined;
    /**
     *
     * Sets the date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
     *
     * @returns This Book, for chainning.
     */
    setDatePattern(datePattern: string): Book;
    /**
     * @returns The lock date of the Book in ISO format yyyy-MM-dd
     */
    getLockDate(): string | undefined;
    /**
     *
     * Sets the lock date of the Book in ISO format yyyy-MM-dd.
     *
     * @returns This Book, for chainning.
     */
    setLockDate(lockDate: string | null): Book;
    /**
     * @returns The closing date of the Book in ISO format yyyy-MM-dd
     */
    getClosingDate(): string | undefined;
    /**
     *
     * Sets the closing date of the Book in ISO format yyyy-MM-dd.
     *
     * @returns This Book, for chainning.
     */
    setClosingDate(closingDate: string | null): Book;
    /**
     * @returns The decimal separator of the Book
     */
    getDecimalSeparator(): DecimalSeparator;
    /**
     *
     * Sets the decimal separator of the Book
     *
     * @returns This Book, for chainning.
     */
    setDecimalSeparator(decimalSeparator: DecimalSeparator): Book;
    /**
     * @returns The time zone of the Book
     */
    getTimeZone(): string | undefined;
    /**
     *
     * Sets the time zone of the Book
     *
     * @returns This Book, for chainning.
     */
    setTimeZone(timeZone: string): Book;
    /**
     * @returns The time zone offset of the book, in minutes
     */
    getTimeZoneOffset(): number | undefined;
    /**
     * @returns The auto post status of the Book
     */
    getAutoPost(): boolean | undefined;
    /**
     *
     * Sets the auto post status of the Book
     *
     * @returns This Book, for chainning.
     */
    setAutoPost(autoPost: boolean): Book;
    /**
     * @returns The last update date of the book, in in milliseconds
     */
    getLastUpdateMs(): number | undefined;
    /**
     * @returns The total number of posted transactions
     */
    getTotalTransactions(): number;
    /**
     * @returns The total number of posted transactions on current month
     */
    getTotalTransactionsCurrentMonth(): number;
    /**
     * @returns The total number of posted transactions on current year
     */
    getTotalTransactionsCurrentYear(): number;
    /**
     * @returns The visibility of the book
     */
    getVisibility(): Visibility;
    /**
     * Gets the custom properties stored in this Book
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     * Gets the property value for given keys. First property found will be retrieved
     *
     * @param keys - The property key
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Sets the custom properties of the Book
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This Book, for chainning.
     */
    setProperties(properties: {
        [key: string]: string;
    }): Book;
    /**
     * Sets a custom property in the Book.
     *
     * @param key - The property key
     * @param value - The property value
     *
     * @returns This Book, for chainning.
     */
    setProperty(key: string, value: string | null): Book;
    /**
     * Formats a date according to date pattern of the Book.
     *
     * @param date - The date to format as string.
     * @param timeZone - The output timezone of the result. Default to script's timeZone
     *
     * @returns The date formated
     */
    formatDate(date: Date, timeZone?: string): string;
    /**
     * Parse a date string according to date pattern and timezone of the Book.
     *
     * Also parse ISO yyyy-mm-dd format.
     */
    parseDate(date: string): Date;
    /**
     * Formats a value according to [[DecimalSeparator]] and fraction digits of the Book.
     *
     * @param value - The value to be formatted.
     *
     * @returns The value formated
     */
    formatValue(value: Amount | number | null | undefined): string;
    /**
     * Parse a value string according to [[DecimalSeparator]] and fraction digits of the Book.
     */
    parseValue(value: string): Amount | undefined;
    /**
     * Rounds a value according to the number of fraction digits of the Book
     *
     * @param value - The value to be rounded
     *
     * @returns The value rounded
     */
    round(value: Amount | number): Amount;
    /**
     * Batch create [[Transactions]] on the Book.
     *
     * @param transactions The transactions to be created
     *
     * @returns The created Transactions
     */
    batchCreateTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    /**
     * Batch post [[Transactions]] on the Book.
     *
     * @param transactions The transactions to be posted
     *
     */
    batchPostTransactions(transactions: Transaction[]): Promise<void>;
    /**
     * Batch update [[Transactions]] on the Book.
     *
     * @param transactions The transactions to be updated
     *
     * @param updateChecked True to also update checked transactions
     *
     * @returns The updated draft Transactions
     *
     */
    batchUpdateTransactions(transactions: Transaction[], updateChecked?: boolean): Promise<Transaction[]>;
    /**
     * Batch check [[Transactions]] on the Book.
     *
     * @param transactions The transactions to be checked
     *
     */
    batchCheckTransactions(transactions: Transaction[]): Promise<void>;
    /**
     * Batch uncheck [[Transactions]] on the Book.
     *
     * @param transactions The transactions to be unchecked
     *
     */
    batchUncheckTransactions(transactions: Transaction[]): Promise<void>;
    /**
     * Batch trash [[Transactions]] on the Book.
     *
     * @param transactions The transactions to be trashed
     *
     * @param trashChecked True to also trash checked transactions
     *
     */
    batchTrashTransactions(transactions: Transaction[], trashChecked?: boolean): Promise<void>;
    /**
     * Batch untrash [[Transactions]] on the Book.
     *
     * @param transactions The transactions to be untrashed
     *
     */
    batchUntrashTransactions(transactions: Transaction[]): Promise<void>;
    /**
     * Replay [[Events]] on the Book, in batch.
     */
    batchReplayEvents(events: Event[], errorOnly?: boolean): Promise<void>;
    /**
     * Create [[Accounts]] on the Book, in batch.
     *
     * @return The created Accounts
     */
    batchCreateAccounts(accounts: Account[]): Promise<Account[]>;
    /**
     * Create [[Groups]] on the Book, in batch.
     *
     * @return The created Groups
     */
    batchCreateGroups(groups: Group[]): Promise<Group[]>;
    /**
     * Trigger [Balances Audit](https://help.bkper.com/en/articles/4412038-balances-audit) async process.
     */
    audit(): void;
    /**
     * Retrieve installed [[Apps]] for this Book
     *
     * @returns The Apps objects
     */
    getApps(): Promise<App[]>;
    /**
     * Gets the existing [[Integrations]] in the Book.
     *
     * @returns The existing Integration objects
     */
    getIntegrations(): Promise<Integration[]>;
    /**
     * Creates a new [[Integration]] in the Book.
     *
     * @param integration - The Integration object or wrapped plain json
     *
     * @returns The created Integration object
     */
    createIntegration(integration: bkper.Integration | Integration): Promise<Integration>;
    /**
     * Updates an existing [[Integration]] in the Book.
     *
     * @param integration - The Integration wrapped plain json
     *
     * @returns The updated Integration object
     */
    updateIntegration(integration: bkper.Integration): Promise<Integration>;
    /**
     * Gets an [[Account]] object
     *
     * @param idOrName - The id or name of the Account
     *
     * @returns The matching Account object
     */
    getAccount(idOrName?: string): Promise<Account | undefined>;








    /**
     * Gets a [[Group]] object
     *
     * @param idOrName - The id or name of the Group
     *
     * @returns The matching Group object
     */
    getGroup(idOrName?: string): Promise<Group | undefined>;
    /**
     * Gets all [[Groups]] of this Book
     *
     * @returns The retrieved Group objects
     */
    getGroups(): Promise<Group[]>;

    /**
     * Gets all [[Accounts]] of this Book
     *
     * @returns The retrieved Account objects
     */
    getAccounts(): Promise<Account[]>;







    /**
     * Lists transactions in the Book based on the provided query, limit, and cursor, for pagination.
     *
     * @param query - The query string to filter transactions
     * @param limit - The maximum number of transactions to return. Default to 100, max to 1000;
     * @param cursor - The cursor for pagination
     *
     * @returns A TransactionPage object containing the list of transactions
     */
    listTransactions(query?: string, limit?: number, cursor?: string): Promise<TransactionList>;
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
    listEvents(afterDate: string | null, beforeDate: string | null, onError: boolean, resourceId: string | null, limit: number, cursor?: string): Promise<EventList>;
    /**
     * Retrieve a transaction by id
     */
    getTransaction(id: string): Promise<Transaction | undefined>;
    /**
     * Retrieve a file by id
     */
    getFile(id: string): Promise<File>;
    /**
     * Performs create new Book.
     *
     * @returns The created Book object
     */
    create(): Promise<Book>;
    /**
     * Perform update Book, applying pending changes.
     */
    update(): Promise<Book>;
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
    getBalancesReport(query: string): Promise<BalancesReport>;
    /**
     * @return The saved queries from this book
     */
    getSavedQueries(): Promise<Query[]>;
}

/**
 *
 * This class defines a Bot Response associated to an [[Event]].
 *
 * @public
 */
export declare class BotResponse {
    payload: bkper.BotResponse;

    constructor(event: Event, payload?: bkper.BotResponse);
    /**
     * @return The type of this Bot Response
     */
    getType(): BotResponseType | undefined;
    /**
     * @return The agent id of this Bot Response
     */
    getAgentId(): string | undefined;
    /**
     * @return The message of this Bot Response
     */
    getMessage(): string | undefined;
    /**
     * @returns The date this Bot Response was created
     */
    getCreatedAt(): Date | undefined;
    /**
     * @returns The Event this Bot Response is associated to
     */
    getEvent(): Event;
    /**
     * Replay this Bot Response.
     *
     * @returns The updated Bot Response
     */
    replay(): Promise<this>;
    /**
     * Delete this Bot Response.
     *
     * @returns The deleted Bot Response
     */
    remove(): Promise<this>;

}

/**
 * Enum that represents the type of a Bot Response
 *
 * @public
 */
export declare enum BotResponseType {
    /**
     * Info bot response
     */
    INFO = "INFO",
    /**
     * Warning bot response
     */
    WARNING = "WARNING",
    /**
     * Error bot response
     */
    ERROR = "ERROR"
}

/**
 * This class defines a Collection of [[Books]].
 *
 * @public
 */
export declare class Collection {
    payload: bkper.Collection;
    constructor(payload?: bkper.Collection);
    /**
     * @returns The wrapped plain json object
     */
    json(): bkper.Collection;
    /**
     * @returns The id of this Collection
     */
    getId(): string | undefined;
    /**
     * @returns The name of this Collection
     */
    getName(): string | undefined;
    /**
     * Sets the name of the Collection.
     *
     * @returns This Collection, for chainning.
     */
    setName(name: string): Collection;
    /**
     * Gets the username of the owner of this Collection
     *
     * @returns The Collection's owner username
     */
    getOwnerUsername(): string | undefined;
    /**
     * Gets the user permission for this Collection
     *
     * @returns The permission for the current user
     */
    getPermission(): Permission | undefined;
    /**
     * @returns All Books of this collection.
     */
    getBooks(): Book[];
    /**
     * Adds Books to this Collection.
     *
     * @returns The added Book objects
     */
    addBooks(books: Book[]): Promise<Book[]>;
    /**
     * Removes Books from this Collection.
     *
     * @returns The removed Book objects
     */
    removeBooks(books: Book[]): Promise<Book[]>;
    /**
     * Gets the last update date of this Collection
     *
     * @returns The Collection's last update timestamp, in milliseconds
     */
    getUpdatedAt(): string | undefined;
    /**
     * Performs create new Collection.
     *
     * @returns The created Collection object
     */
    create(): Promise<Collection>;
    /**
     * Performs update Collection, applying pending changes.
     *
     * @returns The updated Collection object
     */
    update(): Promise<Collection>;
    /**
     * Performs delete Collection.
     *
     * @returns The list of Books the user has access to that were affected by the deletion of this Collection
     */
    remove(): Promise<Book[]>;
}

/**
 * This class defines the [[Bkper]] API Config.
 *
 * @public
 */
export declare interface Config {
    /**
     * The API key to identify the agent.
     *
     * API keys are intended for agent identification only, not for authentication. [Learn more](https://cloud.google.com/endpoints/docs/frameworks/java/when-why-api-key)
     *
     * See how to create your api key [here](https://cloud.google.com/docs/authentication/api-keys).
     */
    apiKeyProvider?: () => Promise<string>;
    /**
     * Issue a valid OAuth2 access token with **https://www.googleapis.com/auth/userinfo.email** scope authorized.
     */
    oauthTokenProvider?: () => Promise<string | undefined>;
    /**
     * Provides additional headers to append to the API request
     */
    requestHeadersProvider?: () => Promise<{
        [key: string]: string;
    }>;
    /**
     * Custom request error handler
     *
     * @param error - The error object of the failed request.
     */
    requestErrorHandler?: (error: any) => any;
    /**
     * Custom request retry handler.
     *
     * This function is called when a request fails and needs to be retried.
     * It provides the HTTP status code, error message, and the number of retry attempts made so far.
     *
     * @param code - The HTTP status code of the failed request.
     * @param error - The error object of the failed request.
     * @param attempt - The number of retry attempts made so far.
     */
    requestRetryHandler?: (status?: number, error?: any, attempt?: number) => Promise<void>;
    /**
     * Sets the base api url. Default to https://app.bkper.com/_ah/api/bkper
     */
    apiBaseUrl?: string;
}

/**
 * This class defines a Connection from an [[User]] to an external service.
 *
 * @public
 */
export declare class Connection {
    payload: bkper.Connection;
    constructor(payload?: bkper.Connection);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.Connection;
    /**
     * Gets the id of the Connection.
     *
     * @returns The Connection's id
     */
    getId(): string | undefined;
    /**
     * Gets the agentId of the Connection.
     *
     * @returns The Connection's agentId
     */
    getAgentId(): string | undefined;
    /**
     * Sets the Connection agentId.
     *
     * @param agentId - The Connection agentId
     *
     * @returns The Connection, for chainning
     */
    setAgentId(agentId: string): Connection;
    /**
     * Gets the name of the Connection.
     *
     * @returns The Connection name
     */
    getName(): string | undefined;
    /**
     * Gets the logo of the Connection.
     *
     * @returns The Connection logo
     */
    getLogo(): string | undefined;
    /**
     * Gets the date when the Connection was added.
     *
     * @returns The Connection add date in milliseconds
     */
    getDateAddedMs(): string | undefined;
    /**
     * Gets the email of the owner of the Connection.
     *
     * @returns The Connection owner's email
     */
    getEmail(): string | undefined;
    /**
     * Sets the name of the Connection.
     *
     * @param name - The name of the Connection
     *
     * @returns The Connection, for chainning
     */
    setName(name: string): Connection;
    /**
     * Sets the universal unique identifier of the Connection.
     *
     * @param uuid - The universal unique identifier of the Connection
     *
     * @returns The Connection, for chainning
     */
    setUUID(uuid: string): Connection;
    /**
     * Gets the universal unique identifier of this Connection.
     *
     * @returns The Connection's universal unique identifier name
     */
    getUUID(): string | undefined;
    /**
     * Gets the type of the Connection.
     *
     * @returns The Connection type
     */
    getType(): "APP" | "BANK" | undefined;
    /**
     * Sets the Connection type.
     *
     * @param type - The Connection type
     *
     * @returns The Connection, for chainning
     */
    setType(type: "APP" | "BANK"): Connection;
    /**
     * Gets the custom properties stored in the Connection
     *
     * @returns Object with key/value pair properties
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     * Sets the custom properties of the Connection.
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns The Connection, for chainning
     */
    setProperties(properties: {
        [key: string]: string;
    }): Connection;
    /**
     * Gets the property value for given keys. First property found will be retrieved.
     *
     * @param keys - The property key
     *
     * @returns The retrieved property value
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Sets a custom property in the Connection.
     *
     * @param key - The property key
     * @param value - The property value
     *
     * @returns The Connection, for chaining
     */
    setProperty(key: string, value: string | null): Connection;
    /**
     * Deletes a custom property stored in the Connection.
     *
     * @param key - The property key
     *
     * @returns The Connection, for chainning
     */
    deleteProperty(key: string): Connection;
    /**
     * Cleans any token property stored in the Connection.
     */
    clearTokenProperties(): void;
    /**
     * Gets the custom properties keys stored in the Connection.
     *
     * @returns The retrieved property keys
     */
    getPropertyKeys(): string[];
    /**
     * Gets the existing [[Integrations]] on the Connection.
     *
     * @returns The existing Integration objects
     */
    getIntegrations(): Promise<Integration[]>;
    /**
     * Performs create new Connection.
     *
     * @returns The created Connection, for chaining
     */
    create(): Promise<Connection>;
    /**
     * Performs remove Connection.
     *
     * @returns The removed Connection object
     */
    remove(): Promise<Connection>;
}

/**
 * Defines a Conversation on Bkper.
 *
 * A Conversation represents an interaction between [[Users]] and [[Apps]].
 *
 * @public
 */
export declare class Conversation {
    payload: bkper.Conversation;


    constructor(agent: Agent, payload?: bkper.Conversation);
    /**
     * @returns The wrapped plain json object
     */
    json(): bkper.Conversation;
    /**
     *
     * @returns The Agent associated to this Conversation
     */
    getAgent(): Agent;
    /**
     *
     * @returns The Conversation universal identifier
     */
    getId(): string | undefined;
    /**
     *
     * @returns The title of the Conversation
     */
    getTitle(): string | undefined;
    /**
     *
     * @returns The Date the Conversation was created
     */
    getCreatedAt(): Date | undefined;
    /**
     *
     * @returns The Date the Conversation was last updated
     */
    getUpdatedAt(): Date | undefined;
    /**
     * Gets the Messages that compose this Conversation
     *
     * @returns The Messages in this Conversation
     */
    getMessages(): Promise<Message[]>;


    /**
     * Performs create Conversation
     *
     * @returns The created Conversation object
     */
    create(): Promise<Conversation>;
}

/**
 * Decimal separator of numbers on book
 *
 * @public
 */
export declare enum DecimalSeparator {
    /**
     * ,
     */
    COMMA = "COMMA",
    /**
     * .
     */
    DOT = "DOT"
}

/**
 *
 * This class defines an Event from a [[Book]].
 *
 * An event is an object that represents an action (such as posting or deleting a [[Transaction]]) made by an actor (such as a user or a [Bot](https://bkper.com/apps) acting on behalf of a user).
 *
 * @public
 */
export declare class Event {
    payload: bkper.Event;


    constructor(book: Book, payload?: bkper.Event);
    /**
     * @returns The wrapped plain json object
     */
    json(): bkper.Event;
    /**
     * @returns The book in which the Event was created
     */
    getBook(): Book;
    /**
     * @returns The id of the Event
     */
    getId(): string | undefined;
    /**
     * @returns The user who performed the Event
     */
    getUser(): User | undefined;
    /**
     * @returns The Agent who performed the Event
     */
    getAgent(): Agent | undefined;
    /**
     * @returns The date the Event was created
     */
    getCreatedAt(): Date | undefined;
    /**
     * @returns The type of the Event
     */
    getType(): EventType | undefined;
    /**
     * @returns The Bot Responses associated to this Event
     */
    getBotResponses(): BotResponse[];
    /**
     * @returns True if this Event has at least one Bot Response of type ERROR
     */
    hasErrorResponse(): boolean;
}

/**
 * A list associated with an event query.
 */
export declare class EventList {
    private payload;

    constructor(book: Book, payload: bkper.EventList);
    /**
     * @returns The cursor associated with the query for pagination.
     */
    getCursor(): string | undefined;
    /**
     * @returns The first Event in the list.
     */
    getFirst(): Event | undefined;
    /**
     *
     * Get the total number of events in the list.
     *
     * @returns The total number of events.
     */
    size(): number;
    /**
     * Get the events in the list.
     *
     * @returns An array of Event objects.
     */
    getItems(): Event[];
}

/**
 * Enum that represents event types.
 *
 * @public
 */
export declare enum EventType {
    FILE_CREATED = "FILE_CREATED",
    TRANSACTION_CREATED = "TRANSACTION_CREATED",
    TRANSACTION_UPDATED = "TRANSACTION_UPDATED",
    TRANSACTION_DELETED = "TRANSACTION_DELETED",
    TRANSACTION_POSTED = "TRANSACTION_POSTED",
    TRANSACTION_CHECKED = "TRANSACTION_CHECKED",
    TRANSACTION_UNCHECKED = "TRANSACTION_UNCHECKED",
    TRANSACTION_RESTORED = "TRANSACTION_RESTORED",
    ACCOUNT_CREATED = "ACCOUNT_CREATED",
    ACCOUNT_UPDATED = "ACCOUNT_UPDATED",
    ACCOUNT_DELETED = "ACCOUNT_DELETED",
    QUERY_CREATED = "QUERY_CREATED",
    QUERY_UPDATED = "QUERY_UPDATED",
    QUERY_DELETED = "QUERY_DELETED",
    GROUP_CREATED = "GROUP_CREATED",
    GROUP_UPDATED = "GROUP_UPDATED",
    GROUP_DELETED = "GROUP_DELETED",
    COMMENT_CREATED = "COMMENT_CREATED",
    COMMENT_DELETED = "COMMENT_DELETED",
    COLLABORATOR_ADDED = "COLLABORATOR_ADDED",
    COLLABORATOR_UPDATED = "COLLABORATOR_UPDATED",
    COLLABORATOR_REMOVED = "COLLABORATOR_REMOVED",
    INTEGRATION_CREATED = "INTEGRATION_CREATED",
    INTEGRATION_UPDATED = "INTEGRATION_UPDATED",
    INTEGRATION_DELETED = "INTEGRATION_DELETED",
    BOOK_UPDATED = "BOOK_UPDATED",
    BOOK_DELETED = "BOOK_DELETED"
}

/**
 *
 * This class defines a File uploaded to a [[Book]].
 *
 * A File can be attached to a [[Transaction]] or used to import data.
 *
 * @public
 */
export declare class File {
    payload: bkper.File;

    constructor(book: Book, payload?: bkper.File);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.File;
    /**
     * Gets the File id
     */
    getId(): string | undefined;
    /**
     * Gets the File name
     */
    getName(): string | undefined;
    /**
     *
     * Sets the name of the File.
     *
     * @returns This File, for chainning.
     */
    setName(name: string): File;
    /**
     * Gets the File content type
     */
    getContentType(): string | undefined;
    /**
     *
     * Sets the File content type.
     *
     * @returns This File, for chainning.
     */
    setContentType(contentType: string): File;
    /**
     * Gets the file content Base64 encoded
     */
    getContent(): Promise<string | undefined>;
    /**
     *
     * Sets the File content Base64 encoded.
     *
     * @returns This File, for chainning.
     */
    setContent(content: string): File;
    /**
     * Gets the file serving url for accessing via browser
     */
    getUrl(): string | undefined;
    /**
     * Gets the file size in bytes
     */
    getSize(): number | undefined;
    /**
     * Perform create new File.
     */
    create(): Promise<File>;
}

/**
 * This class defines a Group of [[Accounts]].
 *
 * Accounts can be grouped by different meaning, like Expenses, Revenue, Assets, Liabilities and so on
 *
 * Its useful to keep organized and for high level analysis.
 *
 * @public
 */
export declare class Group {
    payload: bkper.Group;






    constructor(book: Book, payload?: bkper.Group);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.Group;
    /**
     * @returns The id of this Group
     */
    getId(): string | undefined;
    /**
     * @returns The name of this Group
     */
    getName(): string | undefined;
    /**
     * Sets the name of the Group.
     *
     * @returns This Group, for chainning.
     */
    setName(name: string): Group;
    /**
     * Tells if the Group is locked by the Book owner.
     *
     * @returns True if the Group is locked.
     */
    isLocked(): boolean;
    /**
     * Sets the locked state of the Group.
     *
     * @param locked - The locked state of the Group.
     *
     * @returns This Group, for chainning.
     */
    setLocked(locked: boolean): Group;
    /**
     * @returns The name of this group without spaces and special characters
     */
    getNormalizedName(): string;
    /**
     * @returns All Accounts of this group.
     */
    getAccounts(): Promise<Account[]>;
    /**
     * @returns The type for of the accounts of this group. Null if mixed
     */
    getType(): AccountType;
    /**
     * Gets the custom properties stored in this Group
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     * Sets the custom properties of the Group
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This Group, for chainning.
     */
    setProperties(properties: {
        [key: string]: string;
    }): Group;
    /**
     * Gets the property value for given keys. First property found will be retrieved
     *
     * @param keys - The property key
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Sets a custom property in the Group.
     *
     * @param key - The property key
     * @param value - The property value
     */
    setProperty(key: string, value: string | null): Group;
    /**
     * Delete a custom property
     *
     * @param key - The property key
     *
     * @returns This Group, for chainning.
     */
    deleteProperty(key: string): Group;
    /**
     * Tell if the Group is hidden on main transactions menu
     */
    isHidden(): boolean | undefined;
    /**
     *  Hide/Show group on main menu.
     */
    setHidden(hidden: boolean): Group;
    /**
     * Tell if this is a credit (Incoming and Liabities) group
     */
    isCredit(): boolean | undefined;
    /**
     * Tell if this is a mixed (Assets/Liabilities or Incoming/Outgoing) group
     */
    isMixed(): boolean | undefined;
    /**
     * Tell if the Group is permanent
     */
    isPermanent(): boolean | undefined;
    /**
     * @returns The parent Group
     */
    getParent(): Group | undefined;
    /**
     * Sets the parent Group.
     *
     * @returns This Group, for chainning.
     */
    setParent(group: Group | null | undefined): Group;
    /**
     * Checks if the Group has a parent.
     *
     * @returns True if the Group has a parent, otherwise false.
     */
    hasParent(): boolean;
    /**
     * Retrieves the children of the Group.
     *
     * @returns An array of child Groups.
     */
    getChildren(): Group[];

    /**
     * Retrieves all descendant Groups of the current Group.
     *
     * @returns A set of descendant Groups.
     */
    getDescendants(): Set<Group>;
    /**
     * Retrieves the IDs of all descendant Groups in a tree structure.
     *
     * @returns A set of descendant Group IDs.
     */
    getDescendantTreeIds(): Set<string>;
    /**
     * Checks if the Group has any children.
     *
     * @returns True if the Group has children, otherwise false.
     */
    hasChildren(): boolean;
    /**
     * Checks if the Group is a leaf node (i.e., has no children).
     *
     * @returns True if the Group is a leaf, otherwise false.
     */
    isLeaf(): boolean;
    /**
     * Checks if the Group is a root node (i.e., has no parent).
     *
     * @returns True if the Group is a root, otherwise false.
     */
    isRoot(): boolean;
    /**
     * Retrieves the depth of the Group in the hierarchy.
     *
     * @returns The depth of the Group.
     */
    getDepth(): number;
    /**
     * Retrieves the root Group of the current Group.
     *
     * @returns The root Group.
     */
    getRoot(): Group;
    /**
     * Retrieves the name of the root Group.
     *
     * @returns The name of the root Group.
     */
    getRootName(): string;



    /**
     * @returns True if this group has any account in it
     */
    hasAccounts(): boolean | undefined;
    /**
     * Perform create new group.
     */
    create(): Promise<Group>;
    /**
     * Perform update group, applying pending changes.
     */
    update(): Promise<Group>;
    /**
     * Perform delete group.
     */
    remove(): Promise<Group>;

}

/**
 * This class defines a Integration from an [[User]] to an external service.
 *
 * @public
 */
export declare class Integration {
    payload: bkper.Integration;
    constructor(payload?: bkper.Integration);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.Integration;
    /**
     * Gets the [[Book]] id of the Integration.
     *
     * @returns The Integration's Book id
     */
    getBookId(): string | undefined;
    /**
     * Gets the id of the Integration.
     *
     * @returns This Integration's id
     */
    getId(): string | undefined;
    /**
     * Gets the name of the Integration.
     *
     * @returns The Integration's name
     */
    getName(): string | undefined;
    /**
     * Gets the name of the user who added the Integration.
     *
     * @returns The user name of who added the Integration
     */
    getAddedBy(): string | undefined;
    /**
     * Gets the agent id of the Integration.
     *
     * @returns The Integration's agent id
     */
    getAgentId(): string | undefined;
    /**
     * Gets the logo of the Integration.
     *
     * @returns The Integration's logo
     */
    getLogo(): string | undefined;
    /**
     * Gets the date when the Integration was added.
     *
     * @returns The Integration add date in milliseconds
     */
    getDateAddedMs(): string | undefined;
    /**
     * Gets the date when the Integration was last updated.
     *
     * @returns The Integration last update date in milliseconds
     */
    getLastUpdateMs(): string | undefined;
    /**
     * Gets the custom properties stored in the Integration.
     *
     * @returns Object with key/value pair properties
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     * Sets the custom properties of the Integration.
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns The Integration, for chainning
     */
    setProperties(properties: {
        [key: string]: string;
    }): Integration;
    /**
     * Gets the property value for given keys. First property found will be retrieved.
     *
     * @param keys - The property key
     *
     * @returns The retrieved property value
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Sets a custom property in the Integration.
     *
     * @param key - The property key
     * @param value - The property value
     *
     * @returns The Integration, for chaining
     */
    setProperty(key: string, value: string | null): Integration;
    /**
     * Deletes a custom property stored in the Integration.
     *
     * @param key - The property key
     *
     * @returns The Integration, for chainning
     */
    deleteProperty(key: string): Integration;
    /**
     * Performs remove Integration.
     *
     * @returns The removed Integration object
     */
    remove(): Promise<Integration>;
}

/**
 * Defines a Message on Bkper.
 *
 * A Message is a building block of a [[Conversation]].
 *
 * @public
 */
export declare class Message {
    payload: bkper.Message;


    constructor(conversation: Conversation, payload?: bkper.Message);
    /**
     * @returns The wrapped plain json object
     */
    json(): bkper.Message;
    /**
     *
     * @returns The Message universal identifier
     */
    getId(): string | undefined;
    /**
     *
     * @returns The Agent associated with the Message, in any
     */
    getAgent(): Agent | undefined;
    /**
     *
     * @returns The Conversation of the Message
     */
    getConversation(): Conversation;
    /**
     *
     * @returns The User associated with the Message
     */
    getUser(): User | undefined;
    /**
     *
     * @returns The Date the Message was created
     */
    getCreatedAt(): Date | undefined;
    /**
     *
     * @returns The text content of the Message
     */
    getContent(): string | undefined;
    /**
     *
     * @param content The text content of the Message
     *
     * @returns This Message, for chaining
     */
    setContent(content: string): Message;
    /**
     * @returns The custom properties stored in this Message
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     * Sets the custom properties of the Message
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This Message, for chainning.
     */
    setProperties(properties: {
        [key: string]: string;
    }): Message;
    /**
     * Gets the property value for given keys. First property found will be retrieved.
     *
     * @param keys - The property key
     *
     * @returns The retrieved property value
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Sets a custom property in the Message.
     *
     * @param key - The property key
     * @param value - The property value
     *
     * @returns This Message, for chainning.
     */
    setProperty(key: string, value: string | null): Message;
    /**
     * Deletes a custom property from the Message.
     *
     * @param key - The property key
     *
     * @returns This Message, for chainning.
     */
    deleteProperty(key: string): Message;
    /**
     * Creates the Message and receives the synchronous Agent response.
     *
     * @returns The Agent response Message, with the created Message as its parent
     */
    create(): Promise<Message>;
    /**
     * Streams the Message to the Bkper API.
     */
    stream(): Promise<void>;
}

/**
 * Enum that represents a Month.
 *
 * @public
 */
export declare enum Month {
    JANUARY = "JANUARY",
    FEBRUARY = "FEBRUARY",
    MARCH = "MARCH",
    APRIL = "APRIL",
    MAY = "MAY",
    JUNE = "JUNE",
    JULY = "JULY",
    AUGUST = "AUGUST",
    SEPTEMBER = "SEPTEMBER",
    OCTOBER = "OCTOBER",
    NOVEMBER = "NOVEMBER",
    DECEMBER = "DECEMBER"
}

/**
 * Enum that represents a period slice.
 *
 * @public
 */
export declare enum Period {
    /**
     *  Monthly period
     */
    MONTH = "MONTH",
    /**
     * Quarterly period
     */
    QUARTER = "QUARTER",
    /**
     * Yearly period
     */
    YEAR = "YEAR"
}

/**
 * The Periodicity of the query. It may depend on the level of granularity you write the range params.
 *
 * @public
 */
export declare enum Periodicity {
    /**
     * Example: after:25/01/1983, before:04/03/2013, after:$d-30, before:$d, after:$d-15/$m
     */
    DAILY = "DAILY",
    /**
     * Example: after:jan/2013, before:mar/2013, after:$m-1, before:$m
     */
    MONTHLY = "MONTHLY",
    /**
     * Example: on:2013, after:2013, $y
     */
    YEARLY = "YEARLY"
}

/**
 * Enum representing permissions of user in the Book
 *
 * Learn more at [share article](https://help.bkper.com/en/articles/2569153-share-your-book-with-your-peers).
 *
 * @public
 */
export declare enum Permission {
    /**
     * No permission
     */
    NONE = "NONE",
    /**
     * View transactions, accounts and balances.
     */
    VIEWER = "VIEWER",
    /**
     * Record and delete drafts only. Useful to collect data only
     */
    RECORDER = "RECORDER",
    /**
     * View transactions, accounts, record and delete drafts
     */
    POSTER = "POSTER",
    /**
     * Manage accounts, transactions, book configuration and sharing
     */
    EDITOR = "EDITOR",
    /**
     * Manage everything, including book visibility and deletion. Only one owner per book.
     */
    OWNER = "OWNER"
}

/**
 * Defines a saved Query in a [[Book]].
 *
 * Queries can be saved on Books by users.
 *
 * @public
 */
export declare class Query {
    payload: bkper.Query;

    constructor(book: Book, payload?: bkper.Query);
    /**
     * @returns The wrapped plain json object
     */
    json(): bkper.Query;
    /**
     * @returns The Query universal identifier
     */
    getId(): string | undefined;
    /**
     * @return The title of this saved Query
     */
    getTitle(): string | undefined;
    /**
     * Sets the title of this saved Query.
     *
     * @param title The title of this saved Query
     *
     * @returns This Query, for chaining
     */
    setTitle(title: string): Query;
    /**
     * @return This Query string to be executed
     */
    getQuery(): string | undefined;
    /**
     * Sets the query string associated with this saved Query.
     *
     * @param query The query string to be executed
     *
     * @returns This Query, for chaining
     */
    setQuery(query: string): Query;
    /**
     * Perform create new Query.
     */
    create(): Promise<Query>;
    /**
     * Perform update Query, applying pending changes.
     */
    update(): Promise<Query>;
    /**
     * Perform delete Query.
     */
    remove(): Promise<Query>;

}

/**
 * This class defines a Template.
 *
 * A Template is a pre-configured setup for [[Books]] and associated Google Sheets that provides users with a starting point for specific accounting or financial management needs.
 *
 * @public
 */
export declare class Template {
    payload: bkper.Template;
    constructor(json?: bkper.Template);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.Template;
    /**
     * Gets the name of the Template.
     *
     * @returns The Template's name
     */
    getName(): string | undefined;
    /**
     * Gets the description of the Template.
     *
     * @returns The Template's description
     */
    getDescription(): string | undefined;
    /**
     * Gets the url of the image of the Template.
     *
     * @returns The url of the Template's image
     */
    getImageUrl(): string | undefined;
    /**
     * Gets the category of the Template.
     *
     * @returns The Template's category. Example: "PERSONAL", "BUSINESS", etc
     */
    getCategory(): string | undefined;
    /**
     * Gets the times the Template has been used.
     *
     * @returns The number of times the Template has been used
     */
    getTimesUsed(): number;
    /**
     * Gets the bookId of the [[Book]] associated with the Template.
     *
     * @returns The bookId of the Book associated with the Template
     */
    getBookId(): string | undefined;
    /**
     * Gets the link of the [[Book]] associated with the Template.
     *
     * @returns The link of the Book associated with the Template
     */
    getBookLink(): string | undefined;
    /**
     * Gets the link of the Google Sheets spreadsheet associated with the Template.
     *
     * @returns The link of the Google Sheets spreadsheet associated with the Template
     */
    getSheetsLink(): string | undefined;
}

/**
 *
 * This class defines a Transaction between [credit and debit](http://en.wikipedia.org/wiki/Debits_and_credits) [[Accounts]].
 *
 * A Transaction is the main entity on the [Double Entry](http://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) [Bookkeeping](http://en.wikipedia.org/wiki/Bookkeeping) system.
 *
 * @public
 */
export declare class Transaction {
    payload: bkper.Transaction;

    constructor(book: Book, payload?: bkper.Transaction);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.Transaction;
    /**
     * @returns The book of the Transaction.
     */
    getBook(): Book;
    /**
     * @returns The id of the Transaction.
     */
    getId(): string | undefined;
    /**
     * @returns The id of the agent that created this transaction
     */
    getAgentId(): string | undefined;
    /**
     * @returns The name of the agent that created this transaction
     */
    getAgentName(): string | undefined;
    /**
     * @returns The logo of the agent that created this transaction
     */
    getAgentLogoUrl(): string | undefined;
    /**
     * @returns The logo of the agent that created this transaction in dark mode
     */
    getAgentLogoUrlDark(): string | undefined;
    /**
     * Remote ids are used to avoid duplication.
     *
     * @returns The remote ids of the Transaction.
     */
    getRemoteIds(): string[];
    /**
     * Add a remote id to the Transaction.
     *
     * @param remoteId - The remote id to add.
     *
     * @returns This Transaction, for chainning.
     */
    addRemoteId(remoteId: string): Transaction;
    /**
     * @returns True if transaction was already posted to the accounts. False if is still a Draft.
     */
    isPosted(): boolean | undefined;
    /**
     * @returns True if transaction is checked.
     */
    isChecked(): boolean | undefined;
    /**
     * Set the check state of the Transaction.
     *
     * @param checked - The check state.
     *
     * @returns This Transaction, for chainning.
     */
    setChecked(checked: boolean): Transaction;
    /**
     * @returns True if transaction is in trash.
     */
    isTrashed(): boolean | undefined;
    /**
     * @returns True if a transaction is locked by the book lock/closing date
     */
    isLocked(): boolean;
    /**
     * @returns All #hashtags used on the transaction.
     */
    getTags(): string[];
    /**
     * @returns All urls of the transaction.
     */
    getUrls(): string[];
    /**
     * Sets the Transaction urls. Url starts with https://
     *
     * @param urls - The urls array.
     *
     * @returns This Transaction, for chainning.
     */
    setUrls(urls: string[]): Transaction;
    /**
     * Add a url to the Transaction. Url starts with https://
     *
     * @param url - The url to add.
     *
     * @returns This Transaction, for chainning.
     */
    addUrl(url: string): Transaction;
    /**
     * @returns The files attached to the transaction.
     */
    getFiles(): File[];
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
    addFile(file: File): Transaction;
    /**
     * Check if the transaction has the specified tag.
     */
    hasTag(tag: string): boolean;
    /**
     * Gets the custom properties stored in this Transaction.
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     * Sets the custom properties of the Transaction
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This Transaction, for chainning.
     */
    setProperties(properties: {
        [key: string]: string;
    }): Transaction;
    /**
     * Gets the property value for given keys. First property found will be retrieved
     *
     * @param keys - The property key
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Gets the custom properties keys stored in this Transaction.
     */
    getPropertyKeys(): string[];
    /**
     * Sets a custom property in the Transaction.
     *
     * @param key - The property key
     * @param value - The property value
     *
     * @returns This Transaction, for chainning.
     */
    setProperty(key: string, value: string | null): Transaction;
    /**
     * Delete a custom property
     *
     * @param key - The property key
     *
     * @returns This Transaction, for chainning.
     */
    deleteProperty(key: string): Transaction;
    /**
     * @returns The credit account. The same as origin account.
     */
    getCreditAccount(): Promise<Account | undefined>;
    /**
     * @returns The credit account name.
     */
    getCreditAccountName(): Promise<string | undefined>;
    /**
     *
     * Sets the credit/origin Account of the Transaction. Same as from().
     *
     * @param account - Account id, name or object.
     *
     * @returns This Transaction, for chainning.
     */
    setCreditAccount(account: Account | bkper.Account): Transaction;
    /**
     *
     * Sets the credit/origin Account of the Transaction. Same as setCreditAccount().
     *
     * @param account - Account id, name or object.
     *
     * @returns This Transaction, for chainning.
     */
    from(account: Account | bkper.Account): Transaction;
    /**
     * @returns The debit account. The same as destination account.
     *
     */
    getDebitAccount(): Promise<Account | undefined>;
    /**
     * @returns The debit account name.
     */
    getDebitAccountName(): Promise<string | undefined>;
    /**
     *
     * Sets the debit/destination Account of the Transaction. Same as to().
     *
     * @param account - Account id, name or object.
     *
     * @returns This Transaction, for chainning.
     */
    setDebitAccount(account: Account | bkper.Account): Transaction;
    /**
     *
     * Sets the debit/destination Account of the Transaction. Same as setDebitAccount().
     *
     * @param account - Account id, name or object.
     *
     * @returns This Transaction, for chainning.
     */
    to(account: Account | bkper.Account): Transaction;
    /**
     * @returns The amount of the transaction.
     */
    getAmount(): Amount | undefined;
    /**
     * @returns The amount of the transaction, formatted according to the Book format.
     */
    getAmountFormatted(): string | undefined;
    /**
     *
     * Sets the amount of the Transaction.
     *
     * @returns This Transaction, for chainning.
     */
    setAmount(amount: Amount | number | string): Transaction;
    /**
     * Get the absolute amount of this transaction if the given account is at the credit side, else null.
     *
     * @param account - The account object, id or name.
     */
    getCreditAmount(account: Account | string): Promise<Amount | undefined>;
    /**
     * Gets the absolute amount of this transaction if the given account is at the debit side, else null.
     *
     * @param account - The account object, id or name.
     */
    getDebitAmount(account: Account | string): Promise<Amount | undefined>;
    /**
     * Gets the [[Account]] at the other side of the transaction given the one in one side.
     *
     * @param account - The account object, id or name.
     */
    getOtherAccount(account: Account | string): Promise<Account | undefined>;
    /**
     *
     * The account name at the other side of the transaction given the one in one side.
     *
     * @param account - The account object, id or name.
     */
    getOtherAccountName(account: string | Account): Promise<string | undefined>;
    /**
     *
     * Tell if the given account is credit on the transaction
     *
     * @param account - The account object
     */
    isCredit(account?: Account): Promise<boolean>;
    /**
     *
     * Tell if the given account is debit on the transaction
     *
     * @param account - The account object
     */
    isDebit(account?: Account): Promise<boolean>;

    /**
     * @returns The description of this transaction.
     */
    getDescription(): string;
    /**
     *
     * Sets the description of the Transaction.
     *
     * @returns This Transaction, for chainning.
     */
    setDescription(description: string): Transaction;
    /**
     * @returns The Transaction date, in ISO format yyyy-MM-dd.
     */
    getDate(): string | undefined;
    /**
     *
     * Sets the date of the Transaction.
     *
     * @returns This Transaction, for chainning
     */
    setDate(date: string | Date): Transaction;
    /**
     * @returns The Transaction Date object, on the time zone of the [[Book]].
     */
    getDateObject(): Date;
    /**
     * @returns The Transaction date number, in format YYYYMMDD.
     */
    getDateValue(): number | undefined;
    /**
     * @returns The Transaction date, formatted on the date pattern of the [[Book]].
     */
    getDateFormatted(): string | undefined;
    /**
     * @returns The date the transaction was created.
     */
    getCreatedAt(): Date;
    /**
     * @returns The date the transaction was created, formatted according to the date pattern of the [[Book]].
     */
    getCreatedAtFormatted(): string;
    /**
     * @returns The date the transaction was last updated.
     */
    getUpdatedAt(): Date;
    /**
     * @returns The date the transaction was last updated, formatted according to the date pattern of the [[Book]].
     */
    getUpdatedAtFormatted(): string;


    /**
     * Gets the balance that the [[Account]] has at that day, when listing transactions of that Account.
     *
     * Evolved balances is returned when searching for transactions of a permanent [[Account]].
     *
     * Only comes with the last posted transaction of the day.
     *
     * @param raw - True to get the raw balance, no matter the credit nature of the [[Account]].
     */
    getAccountBalance(raw?: boolean): Promise<Amount | undefined>;
    /**
     * Perform create new draft transaction.
     */
    create(): Promise<Transaction>;
    /**
     * Upddate transaction, applying pending changes.
     */
    update(): Promise<Transaction>;
    /**
     * Perform check transaction.
     */
    check(): Promise<Transaction>;
    /**
     * Perform uncheck transaction.
     */
    uncheck(): Promise<Transaction>;
    /**
     * Perform post transaction, changing credit and debit [[Account]] balances.
     */
    post(): Promise<Transaction>;
    /**
     * Trash the transaction.
     */
    trash(): Promise<Transaction>;
    /**
     * Untrash the transaction.
     */
    untrash(): Promise<Transaction>;
    /** @deprecated */
    remove(): Promise<Transaction>;
    /** @deprecated */
    restore(): Promise<Transaction>;
}

/**
 * A list associated with a transaction query.
 */
export declare class TransactionList {
    private payload;

    constructor(book: Book, payload: bkper.TransactionList);
    /**
     * @returns The cursor associated with the query for pagination.
     */
    getCursor(): string | undefined;
    /**
     * Retrieves the account associated with the query, when filtering by account.
     */
    getAccount(): Promise<Account | undefined>;
    /**
     * @returns The first Transaction in the list.
     */
    getFirst(): Transaction | undefined;
    /**
     *
     * Get the total number of transactions in the list.
     *
     * @returns The total number of transactions.
     */
    size(): number;
    /**
     * Get the transactions in the list.
     *
     * @returns An array of Transaction objects.
     */
    getItems(): Transaction[];
}

/**
 * This class defines a User.
 *
 * @public
 */
export declare class User {
    payload: bkper.User;
    constructor(payload?: bkper.User);
    /**
     * @returns An immutable copy of the json payload
     */
    json(): bkper.User;
    /**
     * Gets the id of the User.
     *
     * @returns The User's id
     */
    getId(): string | undefined;
    /**
     * Gets the name of the User.
     *
     * @returns The User's name
     */
    getName(): string | undefined;
    /**
     * Gets the avatar url of the User.
     *
     * @returns The User's avatar url
     */
    getAvatarUrl(): string | undefined;
    /**
     * Gets the full name of the User.
     *
     * @returns The User's full name
     */
    getFullName(): string | undefined;
    /**
     * Gets the email of the User.
     *
     * @returns The User's email
     */
    getEmail(): string | undefined;
    /**
     * Gets the hosted domain of the User.
     *
     * @returns The User's hosted domain
     */
    getHostedDomain(): string | undefined;
    /**
     * Tells if the User is in the free plan.
     *
     * @returns True if the User is in the free plan
     */
    isFree(): boolean | undefined;
    /**
     * Gets the plan of the User.
     *
     * @returns The User's plan
     */
    getPlan(): string | undefined;
    /**
     * Tells if billing is enabled for the User.
     *
     * @returns True if billing is enabled for the User
     */
    hasBillingEnabled(): boolean | undefined;
    /**
     * Tells if the User has started the trial.
     *
     * @returns True if the User has started the trial
     */
    hasStartedTrial(): boolean | undefined;
    /**
     * Gets the days left in User's trial.
     *
     * @returns The User's days left in trial
     */
    getDaysLeftInTrial(): number | undefined;
    /**
     * Tells if the User has already used [[Connections]].
     *
     * @returns True if the User has already used Connections
     */
    hasUsedConnections(): boolean | undefined;
    /**
     * Gets the [[Connections]] of the User.
     *
     * @returns The retrieved Connection objects
     */
    getConnections(): Promise<Connection[]>;
    /**
     * Gets a [[Connection]] of the User.
     *
     * @param id - The Connection's id
     *
     * @returns The retrieved Connection object
     */
    getConnection(id: string): Promise<Connection>;
}

/**
 * Enum representing the visibility of a Book
 *
 * @public
 */
export declare enum Visibility {
    /**
     * The book can be accessed by anyone with the link
     */
    PUBLIC = "PUBLIC",
    /**
     * The book can be accessed by the owner and collaborators
     */
    PRIVATE = "PRIVATE"
}

export { }
