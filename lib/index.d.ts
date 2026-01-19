/**
 * Bkper REST API Javascript client for Node.js and browsers.
 *
 * Learn more at https://bkper.com/docs
 *
 * @packageDocumentation
 */

/**
 * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
 *
 * It maintains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transactions]].
 *
 * An Account can be grouped by [[Groups]].
 *
 * @public
 */
export declare class Account extends ResourceProperty<bkper.Account> {

    constructor(book: Book, payload?: bkper.Account);

    /**
     * Gets the Account internal id.
     *
     * @returns The Account internal id
     */
    getId(): string | undefined;
    /**
     * Gets the Account name.
     *
     * @returns The Account name
     */
    getName(): string | undefined;
    /**
     * Sets the name of the Account.
     *
     * @param name - The name to set
     *
     * @returns This Account, for chaining
     */
    setName(name: string): Account;
    /**
     * Tells if the balance of this Account has been verified/audited.
     *
     * @returns True if the balance of this Account has been verified/audited
     */
    isBalanceVerified(): boolean | undefined;
    /**
     * Gets the normalized name of this Account without spaces or special characters.
     *
     * @returns The name of this Account without spaces or special characters
     */
    getNormalizedName(): string;
    /**
     * Gets the type of this Account.
     *
     * @returns The [[AccountType]] of this Account
     */
    getType(): AccountType;
    /**
     * Sets the type of the Account.
     *
     * @param type - The [[AccountType]] to set
     *
     * @returns This Account, for chaining
     */
    setType(type: AccountType): Account;
    /**
     * Tells if this Account is archived.
     *
     * @returns True if the Account is archived
     */
    isArchived(): boolean | undefined;
    /**
     * Sets Account archived/unarchived.
     *
     * @param archived - True to archive, false to unarchive
     *
     * @returns This Account, for chaining
     */
    setArchived(archived: boolean): Account;
    /**
     * Tells if the Account has any transaction already posted.
     *
     * Accounts with transaction posted, even with zero balance, can only be archived.
     *
     * @returns True if the Account has transactions posted
     */
    hasTransactionPosted(): boolean | undefined;
    /**
     * Tells if the Account is permanent.
     *
     * Permanent Accounts are the ones which final balance is relevant and keep its balances over time.
     *
     * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(Accountancy)#Based_on_periodicity_of_flow)
     *
     * Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank Accounts, money, debts and so on.
     *
     * @returns True if its a permanent Account
     */
    isPermanent(): boolean | undefined;
    /**
     * Tells if the Account has a Credit nature or Debit otherwise.
     *
     * Credit Accounts are just for representation purposes. It increase or decrease the absolute balance. It doesn't affect the overall balance or the behavior of the system.
     *
     * The absolute balance of credit Accounts increase when it participate as a credit/origin in a transaction. Its usually for Accounts that increase the balance of the assets, like revenue Accounts.
     *
     * ```
     *         Crediting a credit
     *   Thus ---------------------> Account increases its absolute balance
     *         Debiting a debit
     *
     *
     *         Debiting a credit
     *   Thus ---------------------> Account decreases its absolute balance
     *         Crediting a debit
     * ```
     *
     * As a rule of thumb, and for simple understanding, almost all Accounts are Debit nature (NOT credit), except the ones that "offers" amount for the books, like revenue Accounts.
     *
     * @returns True if the Account has credit nature
     */
    isCredit(): boolean | undefined;
    /**
     * Gets the [[Groups]] of this Account.
     *
     * @returns Promise with the [[Groups]] of this Account
     */
    getGroups(): Promise<Group[]>;
    /**
     * Sets the groups of the Account.
     *
     * @param groups - The groups to set
     *
     * @returns This Account, for chaining
     */
    setGroups(groups: Group[] | bkper.Group[]): Account;
    /**
     * Adds a group to the Account.
     *
     * @param group - The group to add
     *
     * @returns This Account, for chaining
     */
    addGroup(group: Group | bkper.Group): Account;
    /**
     * Removes a group from the Account.
     *
     * @param group - The group name, id or object to remove
     *
     * @returns Promise with this Account, for chaining
     */
    removeGroup(group: string | Group): Promise<Account>;
    /**
     * Tells if this Account is in the [[Group]].
     *
     * @param group - The Group name, id or object
     *
     * @returns Promise with true if the Account is in the group
     */
    isInGroup(group: string | Group): Promise<boolean>;

    /**
     * Performs create new Account.
     *
     * @returns Promise with this Account after creation
     */
    create(): Promise<Account>;
    /**
     * Performs update Account, applying pending changes.
     *
     * @returns Promise with this Account after update
     */
    update(): Promise<Account>;
    /**
     * Performs delete Account.
     *
     * @returns Promise with this Account after deletion
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
     * Gets the wrapped plain JSON object.
     *
     * @returns The wrapped plain json object
     */
    json(): bkper.Agent;
    /**
     * Gets the Agent universal identifier.
     *
     * @returns The Agent universal identifier
     */
    getId(): string | undefined;
    /**
     * Gets the Agent name.
     *
     * @returns The Agent name
     */
    getName(): string | undefined;
    /**
     * Gets the Agent logo URL.
     *
     * @returns The Agent logo url
     */
    getLogoUrl(): string | undefined;
    /**
     * Gets the Agent logo URL in dark mode.
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
     *
     * @param n - The number, string, or Amount to initialize with
     */
    constructor(n: number | string | Amount);
    /**
     * Returns an absolute Amount.
     *
     * @returns The absolute value as a new Amount
     */
    abs(): Amount;
    /**
     * Compares this Amount with another value.
     *
     * @param n - The value to compare with
     *
     * @returns -1 if less than, 0 if equal, 1 if greater than
     */
    cmp(n: number | string | Amount): -1 | 0 | 1;
    /**
     * Divides this Amount by another value.
     *
     * @param n - The divisor value
     *
     * @returns The division result as a new Amount
     */
    div(n: number | string | Amount): Amount;
    /**
     * Checks if this Amount equals another value.
     *
     * @param n - The value to compare with
     *
     * @returns True if equal, false otherwise
     */
    eq(n: number | string | Amount): boolean;
    /**
     * Checks if this Amount is greater than another value.
     *
     * @param n - The value to compare with
     *
     * @returns True if greater than, false otherwise
     */
    gt(n: number | string | Amount): boolean;
    /**
     * Checks if this Amount is greater than or equal to another value.
     *
     * @param n - The value to compare with
     *
     * @returns True if greater than or equal, false otherwise
     */
    gte(n: number | string | Amount): boolean;
    /**
     * Checks if this Amount is less than another value.
     *
     * @param n - The value to compare with
     *
     * @returns True if less than, false otherwise
     */
    lt(n: number | string | Amount): boolean;
    /**
     * Checks if this Amount is less than or equal to another value.
     *
     * @param n - The value to compare with
     *
     * @returns True if less than or equal, false otherwise
     */
    lte(n: number | string | Amount): boolean;
    /**
     * Adds another value to this Amount.
     *
     * @param n - The value to add
     *
     * @returns The sum as a new Amount
     */
    plus(n: number | string | Amount): Amount;
    /**
     * Subtracts another value from this Amount.
     *
     * @param n - The value to subtract
     *
     * @returns The difference as a new Amount
     */
    minus(n: number | string | Amount): Amount;
    /**
     * Calculates the modulo (remainder) of dividing this Amount by another value.
     *
     * Similar to % operator
     *
     * @param n - The divisor value
     *
     * @returns The remainder as a new Amount
     */
    mod(n: number | string | Amount): Amount;
    /**
     * Rounds this Amount to a maximum of dp decimal places.
     *
     * @param dp - The number of decimal places (optional)
     *
     * @returns The rounded value as a new Amount
     */
    round(dp?: number): Amount;
    /**
     * Multiplies this Amount by another value.
     *
     * @param n - The value to multiply by
     *
     * @returns The product as a new Amount
     */
    times(n: number | string | Amount): Amount;
    /**
     * Returns a string representing the value of this Amount in normal notation to a fixed number of decimal places.
     *
     * @param dp - The number of decimal places (optional)
     *
     * @returns The formatted string representation
     */
    toFixed(dp?: number): string;
    /**
     * Returns a string representing the value of this Amount.
     *
     * @returns The string representation of this Amount
     */
    toString(): string;
    /**
     * Returns a primitive number representing the value of this Amount.
     *
     * @returns The numeric value of this Amount
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
export declare class App extends Resource<bkper.App> {
    private config?;
    constructor(payload?: bkper.App, config?: Config);

    /**
     * Sets the webhook url for development.
     *
     * @param webhookUrlDev - The webhook URL for development
     *
     * @returns This App, for chaining
     */
    setWebhookUrlDev(webhookUrlDev: string): App;
    /**
     * Gets the App universal identifier.
     *
     * @returns The App universal identifier
     */
    getId(): string | undefined;
    /**
     * Gets the name of this App.
     *
     * @returns The name of this App
     */
    getName(): string | undefined;
    /**
     * Checks if this App has events bound to it.
     *
     * @returns True if this App has events bound to it
     */
    hasEvents(): boolean;
    /**
     * Gets the events bound to this App.
     *
     * @returns The events bound to this App
     */
    getEvents(): EventType[] | undefined;
    /**
     * Checks if this App is published.
     *
     * @returns True if this App is published
     */
    isPublished(): boolean;
    /**
     * Tells if this App is installable.
     *
     * @returns True if this App is installable
     */
    isInstallable(): boolean;
    /**
     * Gets the logo url of this App.
     *
     * @returns The logo url of this App
     */
    getLogoUrl(): string | undefined;
    /**
     * Gets the logo url of this App in dark mode.
     *
     * @returns The logo url of this App in dark mode
     */
    getLogoUrlDark(): string | undefined;
    /**
     * Gets the description of this App.
     *
     * @returns The description of this App
     */
    getDescription(): string | undefined;
    /**
     * Sets the whitelisted users (usernames and domain patterns).
     *
     * @param users - The users to whitelist (comma or space separated usernames and domain patterns like *@domain.com)
     *
     * @returns This App for chaining
     */
    setUsers(users?: string): App;
    /**
     * Gets the whitelisted users (usernames and domain patterns).
     *
     * @returns The users string
     */
    getUsers(): string | undefined;
    /**
     * Gets the menu url of this App.
     *
     * @returns The menu url of this App
     */
    getMenuUrl(): string | undefined;
    /**
     * Gets the menu development url of this App.
     *
     * @returns The menu development url of this App
     */
    getMenuUrlDev(): string | undefined;
    /**
     * Gets the menu text of this App.
     *
     * @returns The menu text of this App
     */
    getMenuText(): string | undefined;
    /**
     * Gets the menu popup width of this App.
     *
     * @returns The menu popup width of this App
     */
    getMenuPopupWidth(): string | undefined;
    /**
     * Gets the menu popup height of this App.
     *
     * @returns The menu popup height of this App
     */
    getMenuPopupHeight(): string | undefined;
    /**
     * Gets the name of the owner of this App.
     *
     * @returns The name of the owner of this App
     */
    getOwnerName(): string | undefined;
    /**
     * Gets the logo url of the owner of this App.
     *
     * @returns The logo url of the owner of this App
     */
    getOwnerLogoUrl(): string | undefined;
    /**
     * Gets the website url of the owner of this App.
     *
     * @returns The website url of the owner of this App
     */
    getOwnerWebsiteUrl(): string | undefined;
    /**
     * Gets the file patterns the App handles.
     *
     * @returns The file patterns the App handles - E.g *.pdf *.csv
     */
    getFilePatterns(): string[] | undefined;
    /**
     * Sets the developers (usernames and domain patterns).
     *
     * @param developers - The developers (comma or space separated usernames and domain patterns like *@domain.com)
     *
     * @returns This App for chaining
     */
    setDevelopers(developers?: string): App;
    /**
     * Gets the developers (usernames and domain patterns).
     *
     * @returns The developers string
     */
    getDevelopers(): string | undefined;
    /**
     * Sets the client secret.
     *
     * @param clientSecret - The client secret to set
     *
     * @returns This App for chaining
     */
    setClientSecret(clientSecret?: string): App;
    /**
     * Gets the website url of this App.
     *
     * @returns The website url of this App
     */
    getWebsiteUrl(): string | undefined;
    /**
     * Tells if the repository is private.
     *
     * @returns True if the repository is private
     */
    isRepositoryPrivate(): boolean | undefined;
    /**
     * Gets the repository url of this App.
     *
     * @returns The repository url of this App
     */
    getRepositoryUrl(): string | undefined;
    /**
     * Gets the readme.md file as text.
     *
     * @returns The readme text
     */
    getReadme(): string | undefined;
    /**
     * Sets the readme.md file as text.
     *
     * @param readme - The readme text to set
     *
     * @returns This App, for chaining
     */
    setReadme(readme?: string): App;
    /**
     * Performs the app creation, applying pending changes.
     *
     * The App id MUST be unique. If another app is already existing, an error will be thrown.
     *
     * @returns This App after creation
     */
    create(): Promise<App>;
    /**
     * Partially updates an App, applying pending changes.
     *
     * @returns This App after the partial update
     */
    patch(): Promise<App>;
    /**
     * Performs a full update of the App, applying pending changes.
     *
     * @returns This App after the update
     */
    update(): Promise<App>;
}

/**
 *
 * This class defines the Backlog of a [[Book]].
 *
 * A Backlog is a list of pending tasks in a Book
 *
 * @public
 */
export declare class Backlog extends Resource<bkper.Backlog> {
    private config?;
    constructor(payload?: bkper.Backlog, config?: Config);

    /**
     * Returns the number of pending tasks in this Backlog.
     *
     * @returns The number of tasks in the Backlog, or undefined if not available.
     */
    getCount(): number | undefined;
}

/**
 * Class that represents an [[Account]] or [[Group]] balance on a window of time (Day / Month / Year).
 *
 * @public
 */
export declare class Balance {
    payload: bkper.Balance;
    private container;
    constructor(container: BalancesContainer, balancePlain: bkper.Balance);
    /**
     * The day of the balance. Days starts on 1 to 31.
     *
     * Day can be 0 (zero) in case of Monthly or Early [[Periodicity]] of the [[BalancesReport]]
     */
    getDay(): number;
    /**
     * The month of the balance. Months starts on 1 (January) to 12 (December)
     *
     * Month can be 0 (zero) in case of Early [[Periodicity]] of the [[BalancesReport]]
     */
    getMonth(): number;
    /**
     * The year of the balance
     */
    getYear(): number;
    /**
     * Date object constructed based on [[Book]] time zone offset. Usefull for
     *
     * If Month or Day is zero, the date will be constructed with first Month (January) or Day (1) of the next period.
     */
    getDate(): Date;
    /**
     * The Fuzzy Date of the balance, based on [[Periodicity]] of the [[BalancesReport]] query, composed by Year, Month and Day.
     *
     * The format is **YYYYMMDD**. Very usefull for ordering and indexing
     *
     * Month and Day can be 0 (zero), depending on the granularity of the [[Periodicity]].
     *
     * *Example:*
     *
     * **20180125** - 25, January, 2018 - DAILY Periodicity
     *
     * **20180100** - January, 2018 - MONTHLY Periodicity
     *
     * **20180000** - 2018 - YEARLY Periodicity
     */
    getFuzzyDate(): number;
    /**
     * The cumulative balance to the date, based on the credit nature of the container
     */
    getCumulativeBalance(): Amount;
    /**
     * The raw cumulative balance to the date.
     */
    getCumulativeBalanceRaw(): Amount;
    /**
     * The cumulative credit to the date.
     */
    getCumulativeCredit(): Amount;
    /**
     * The cumulative debit to the date.
     */
    getCumulativeDebit(): Amount;
    /**
     * The balance on the date period, based on credit nature of the container.
     */
    getPeriodBalance(): Amount;
    /**
     * The raw balance on the date period.
     */
    getPeriodBalanceRaw(): Amount;
    /**
     * The credit on the date period.
     */
    getPeriodCredit(): Amount;
    /**
     * The debit on the date period.
     */
    getPeriodDebit(): Amount;
}

/**
 * The container of balances of an [[Account]] or [[Group]]
 *
 * The container is composed of a list of [[Balances]] for a window of time, as well as its period and cumulative totals.
 *
 * @public
 */
export declare interface BalancesContainer {
    payload: bkper.AccountBalances | bkper.GroupBalances;
    /**
     * Gets the parent [[BalancesReport]] of the container.
     *
     * @returns The parent [[BalancesReport]] of the container
     */
    getBalancesReport: () => BalancesReport;
    /**
     * Gets the [[Account]] or [[Group]] name.
     *
     * @returns The [[Account]] or [[Group]] name
     */
    getName: () => string;
    /**
     * Gets the [[Account]] or [[Group]] name without spaces or special characters.
     *
     * @returns The [[Account]] or [[Group]] name without spaces or special characters
     */
    getNormalizedName: () => string;
    /**
     * Gets the [[Group]] associated with this container.
     *
     * @returns The [[Group]] associated with this container
     */
    getGroup: () => Promise<Group | null>;
    /**
     * Gets the [[Account]] associated with this container.
     *
     * @returns The [[Account]] associated with this container
     */
    getAccount: () => Promise<Account | null>;
    /**
     * Gets the parent BalanceContainer.
     *
     * @returns The parent BalanceContainer
     */
    getParent: () => BalancesContainer | null;
    /**
     * Gets all [[Balances]] of the container
     *
     * @returns All [[Balances]] of the container
     */
    getBalances: () => Balance[];
    /**
     * Gets the depth in the parent chain up to the root.
     *
     * @returns The depth in the parent chain up to the root
     */
    getDepth: () => number;
    /**
     * Gets the credit nature of the BalancesContainer, based on [[Account]] or [[Group]].
     *
     * For [[Account]], the credit nature will be the same as the one from the Account.
     *
     * For [[Group]], the credit nature will be the same, if all accounts containing on it has the same credit nature. False if mixed.
     *
     * @returns The credit nature of the BalancesContainer
     */
    isCredit: () => boolean | undefined;
    /**
     * Tell if this balance container is permanent, based on the [[Account]] or [[Group]].
     *
     * Permanent are the ones which final balance is relevant and keep its balances over time.
     *
     * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow).
     *
     * Usually represents assets or liabilities, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
     *
     * @returns True if its a permanent Account
     */
    isPermanent: () => boolean;
    /**
     * Gets whether this balance container is from an [[Account]].
     *
     * @returns True if this balance container if from an [[Account]]
     */
    isFromAccount: () => boolean;
    /**
     * Gets whether this balance container is from a [[Group]].
     *
     * @returns True if this balance container if from a [[Group]]
     */
    isFromGroup: () => boolean;
    /**
     * Gets whether the balance container is from a parent group.
     *
     * @returns True if the balance container is from a parent group
     */
    hasGroupBalances: () => boolean;
    /**
     * Gets the cumulative balance to the date.
     *
     * @returns The cumulative balance to the date
     */
    getCumulativeBalance: () => Amount;
    /**
     * Gets the cumulative raw balance to the date.
     *
     * @returns The cumulative raw balance to the date
     */
    getCumulativeBalanceRaw: () => Amount;
    /**
     * The cumulative credit to the date.
     */
    getCumulativeCredit(): Amount;
    /**
     * The cumulative debit to the date.
     */
    getCumulativeDebit(): Amount;
    /**
     * Gets the cumulative balance formatted according to [[Book]] decimal format and fraction digits.
     *
     * @returns The cumulative balance formatted according to [[Book]] decimal format and fraction digits
     */
    getCumulativeBalanceText: () => string;
    /**
     * Gets the cumulative raw balance formatted according to [[Book]] decimal format and fraction digits.
     *
     * @returns The cumulative raw balance formatted according to [[Book]] decimal format and fraction digits
     */
    getCumulativeBalanceRawText: () => string;
    /**
     * The cumulative credit formatted according to [[Book]] decimal format and fraction digits.
     */
    getCumulativeCreditText(): string;
    /**
     * The cumulative credit formatted according to [[Book]] decimal format and fraction digits.
     */
    getCumulativeDebitText(): string;
    /**
     * Gets the balance on the date period.
     *
     * @returns The balance on the date period
     */
    getPeriodBalance: () => Amount;
    /**
     * Gets the raw balance on the date period.
     *
     * @returns The raw balance on the date period
     */
    getPeriodBalanceRaw: () => Amount;
    /**
     * The credit on the date period.
     */
    getPeriodCredit(): Amount;
    /**
     * The debit on the date period.
     */
    getPeriodDebit(): Amount;
    /**
     * Gets the balance on the date period formatted according to [[Book]] decimal format and fraction digits.
     *
     * @returns The balance on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodBalanceText: () => string;
    /**
     * Gets the raw balance on the date period formatted according to [[Book]] decimal format and fraction digits.
     *
     * @returns The raw balance on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodBalanceRawText: () => string;
    /**
     * The credit on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodCreditText(): string;
    /**
     * The debit on the date period formatted according to [[Book]] decimal format and fraction digits
     */
    getPeriodDebitText(): string;
    /**
     * Gets the custom properties stored in this Account or Group.
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     *
     * Gets the property value for given keys. First property found will be retrieved
     *
     * @param keys - The property key
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Gets the custom properties keys stored in the associated [[Account]] or [[Group]].
     */
    getPropertyKeys(): string[];
    /**
     * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]]
     */
    createDataTable(): BalancesDataTableBuilder;
    /**
     * Gets all child [[BalancesContainers]].
     *
     * **NOTE**: Only for Group balance containers. Accounts returns null.
     *
     * @returns All child [[BalancesContainers]]
     */
    getBalancesContainers: () => BalancesContainer[];
    /**
     * Gets a specific [[BalancesContainer]].
     *
     * @param name - The [[Account]] or [[Group]] name
     *
     * @returns The retrieved [[BalancesContainer]]
     */
    getBalancesContainer: (name: string) => BalancesContainer;
}

/**
 * A BalancesDataTableBuilder is used to setup and build two-dimensional arrays containing balance information.
 *
 * @public
 */
export declare class BalancesDataTableBuilder implements BalancesDataTableBuilder {
    private balanceType;
    private balancesContainers;
    private periodicity;
    private shouldFormatDate;
    private shouldHideDates;
    private shouldHideNames;
    private shouldFormatValue;
    private book;
    private shouldTranspose;
    private shouldTrial;
    private shouldPeriod;
    private shouldRaw;
    private shouldAddProperties;
    private maxDepth;
    private expandAllAccounts;
    private expandAllGroups;
    private skipRoot;
    constructor(book: Book, balancesContainers: BalancesContainer[], periodicity: Periodicity);
    private getBalance;
    private getRepresentativeBalance;
    private getBalanceText;
    /**
     * Defines whether the dates should be ISO formatted YYYY-MM-DD. E.g. 2025-01-01
     *
     * @returns This builder with respective formatting option, for chaining.
     */
    formatDates(format: boolean): BalancesDataTableBuilder;
    /**
     * Defines whether the value should be formatted based on decimal separator of the [[Book]].
     *
     * @returns This builder with respective formatting option, for chaining.
     */
    formatValues(format: boolean): BalancesDataTableBuilder;
    /**
     * Defines whether Groups should expand its child accounts.
     *
     * true to expand itself
     * -1 to expand all subgroups
     * -2 to expand all accounts
     * 0 to expand nothing
     * 1 to expand itself and its first level of children
     * 2 to expand itself and its first two levels of children
     * etc.
     *
     * @returns This builder with respective expanded option, for chaining.
     */
    expanded(expanded: boolean | number): BalancesDataTableBuilder;
    /**
     * Fluent method to set the [[BalanceType]] for the builder.
     *
     * @param type - The type of balance for this data table
     *
     * For **TOTAL** [[BalanceType]], the table format looks like:
     *
     * ```
     *   _____________________
     *  | Expenses  | -4568.23 |
     *  | Income    |  5678.93 |
     *  |    ...    |    ...   |
     *  |___________|__________|
     *
     * ```
     * Two columns, and each [[Account]] or [[Group]] per line.
     *
     * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the table will be a time table, and the format looks like:
     *
     * ```
     *  _______________________________________________________________
     *  |            | 15/01/2014 | 15/02/2014 | 15/03/2014 |    ...    |
     *  |  Expenses  | -2345.23   | -2345.93   | -2456.45   |    ...    |
     *  |  Income    |  3452.93   |  3456.46   |  3567.87   |    ...    |
     *  |     ...    |     ...    |     ...    |     ...    |    ...    |
     *  |____________|____________|____________|____________|___________|
     *
     * ```
     *
     * First column will be the [[Account]] or [[Group]] name, and one column for each Date.
     *
     * @returns This builder with respective balance type, for chaining.
     */
    type(type: BalanceType): BalancesDataTableBuilder;
    /**
     * Defines whether should rows and columns should be transposed.
     *
     * For **TOTAL** [[BalanceType]], the **transposed** table looks like:
     *
     * ```
     *   _____________________________
     *  |  Expenses | Income  |  ...  |
     *  | -4568.23  | 5678.93 |  ...  |
     *  |___________|_________|_______|
     *
     * ```
     * Two rows, and each [[Account]] or [[Group]] per column.
     *
     *
     * For **PERIOD** or **CUMULATIVE** [[BalanceType]], the **transposed** table will be a time table, and the format looks like:
     *
     * ```
     *   _______________________________________________________________
     *  |            | Expenses   | Income     |     ...    |    ...    |
     *  | 15/01/2014 | -2345.23   |  3452.93   |     ...    |    ...    |
     *  | 15/02/2014 | -2345.93   |  3456.46   |     ...    |    ...    |
     *  | 15/03/2014 | -2456.45   |  3567.87   |     ...    |    ...    |
     *  |     ...    |     ...    |     ...    |     ...    |    ...    |
     *  |____________|____________|____________|____________|___________|
     *
     * ```
     *
     * First column will be each Date, and one column for each [[Account]] or [[Group]].
     *
     * @returns This builder with respective transposed option, for chaining.
     */
    transposed(transposed: boolean): BalancesDataTableBuilder;
    /**
     * Defines whether the dates should be hidden for **PERIOD** or **CUMULATIVE** [[BalanceType]].
     *
     * @returns This builder with respective hide dates option, for chaining.
     */
    hideDates(hide: boolean): BalancesDataTableBuilder;
    /**
     * Defines whether the [[Accounts]] and [[Groups]] names should be hidden.
     *
     * @returns This builder with respective hide names option, for chaining.
     */
    hideNames(hide: boolean): BalancesDataTableBuilder;
    /**
     * Defines whether include custom [[Accounts]] and [[Groups]] properties.
     *
     * @returns This builder with respective include properties option, for chaining.
     */
    properties(include: boolean): BalancesDataTableBuilder;
    /**
     * Defines whether should split **TOTAL** [[BalanceType]] into debit and credit.
     *
     * @returns This builder with respective trial option, for chaining.
     */
    trial(trial: boolean): BalancesDataTableBuilder;
    /**
     * Defines whether should force use of period balances for **TOTAL** [[BalanceType]].
     *
     * @returns This builder with respective trial option, for chaining.
     */
    period(period: boolean): BalancesDataTableBuilder;
    /**
     * Defines whether should show raw balances, no matter the credit nature of the Account or Group.
     *
     * @returns This builder with respective trial option, for chaining.
     */
    raw(raw: boolean): BalancesDataTableBuilder;
    /**
     *
     * Builds an two-dimensional array with the balances.
     *
     */
    build(): any[][];
    private addPropertyKeys;
    private flattenContainers;
    private flattenAllAccounts;
    private sortContainersFunction;
    private flattenMaxDepth;
    private flattenAllGroups;
    private buildTotalDataTable_;
    private buildTimeDataTable_;
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
     * Gets the [[Book]] that generated the report.
     *
     * @returns The [[Book]] that generated the report
     */
    getBook(): Book;
    /**
     * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]].
     */
    createDataTable(): BalancesDataTableBuilder;
    /**
     * Gets the [[Periodicity]] of the query used to generate the report.
     *
     * @returns The [[Periodicity]] of the query used to generate the report
     */
    getPeriodicity(): Periodicity;
    /**
     * Gets all [[BalancesContainers]] of the report.
     *
     * @returns All [[BalancesContainers]] of the report
     */
    getBalancesContainers(): BalancesContainer[];
    /**
     * Gets a specific [[BalancesContainer]].
     *
     * @param name - The [[Account]] or [[Group]] name
     *
     * @returns The retrieved [[BalancesContainer]]
     */
    getBalancesContainer(name: string): BalancesContainer;



}

/**
 * Enum that represents balance types.
 *
 * @public
 */
export declare enum BalanceType {
    /**
     * Total balance
     */
    TOTAL = "TOTAL",
    /**
     * Period balance
     */
    PERIOD = "PERIOD",
    /**
     * Cumulative balance
     */
    CUMULATIVE = "CUMULATIVE"
}

/**
 * This class defines the Billing information for a [[User]].
 *
 * The Billing information includes the plan, the admin email, and the billing portal URL.
 *
 * @public
 */
export declare class Billing extends Resource<bkper.Billing> {
    private config?;
    constructor(json?: bkper.Billing, config?: Config);

    /**
     * Tells if billing is enabled for the User.
     *
     * @returns True if billing is enabled for the User
     */
    isEnabled(): boolean | undefined;
    /**
     * Gets the current plan of the User.
     *
     * @returns The User's plan
     */
    getPlan(): string | undefined;
    /**
     * Tells if the User's current plan payment is overdue.
     *
     * @returns True if the plan payment is overdue
     */
    isPlanOverdue(): boolean | undefined;
    /**
     * Gets the admin email for this User's billing account.
     *
     * @returns The billing admin email
     */
    getAdminEmail(): string | undefined;
    /**
     * Tells if the User has started the trial period.
     *
     * @returns True if the User has started the trial period
     */
    hasStartedTrial(): boolean | undefined;
    /**
     * Gets the number of days left in User's trial period.
     *
     * @returns The number of days left in trial period
     */
    getDaysLeftInTrial(): number | undefined;
    /**
     * Gets the number of total transactions this month for the User's billing account.
     *
     * @returns The number of total transactions this month
     */
    getTotalTransactionsThisMonth(): number | undefined;
    /**
     * Gets the number of total transactions this year for the User's billing account.
     *
     * @returns The number of total transactions this year
     */
    getTotalTransactionsThisYear(): number | undefined;
}

/**
 * This is the main entry point of the [bkper-js](https://www.npmjs.com/package/bkper-js) library.
 *
 * You can configure the library in two ways:
 *
 * 1. Using static configuration (traditional approach):
 *
 * ```typescript
 * Bkper.setConfig({
 *   apiKeyProvider: () => process.env.BKPER_API_KEY,
 *   oauthTokenProvider: () => process.env.BKPER_OAUTH_TOKEN
 * });
 *
 * const bkper = new Bkper();
 * const book = await bkper.getBook('bookId');
 * ```
 *
 * 2. Using per-instance configuration (recommended for Cloudflare Workers):
 *
 * ```typescript
 * const bkper = new Bkper({
 *   apiKeyProvider: () => process.env.BKPER_API_KEY,
 *   oauthTokenProvider: () => process.env.BKPER_OAUTH_TOKEN
 * });
 *
 * const book = await bkper.getBook('bookId');
 * ```
 *
 * @public
 */
export declare class Bkper {

    private config;
    /**
     * Sets the global API configuration for all Bkper operations.
     *
     * WARNING: This configuration will be shared and should NOT be used on shared environments.
     *
     * @param config - The Config object containing API key and OAuth token providers
     */
    static setConfig(config: Config): void;
    /**
     * Creates a new Bkper instance with the provided configuration.
     *
     * @param config - The Config object containing API key and OAuth token providers.
     *                 If not provided, uses the global configuration set via setConfig().
     */
    constructor(config?: Config);
    /**
     * Gets the current instance configuration.
     *
     * @returns The Config object for this Bkper instance
     */
    getConfig(): Config;
    /**
     * Gets the [[Book]] with the specified bookId from url param.
     *
     * @param id - The universal book id - The same bookId param of URL you access at app.bkper.com
     * @param includeAccounts - Optional parameter to include accounts in the retrieved Book
     * @param includeGroups - Optional parameter to include groups in the retrieved Book
     *
     * If both includeAccounts and includeGroups are false, the Book will be returned with only the basic information.
     *
     * If includeAccounts is true, the Book will be returned with the accounts and groups.
     *
     * If includeGroups is true, the Book will be returned with the groups.
     *
     * @returns The retrieved Book
     */
    getBook(id: string, includeAccounts?: boolean, includeGroups?: boolean): Promise<Book>;
    /**
     * Gets all [[Books]] the user has access to.
     *
     * @param query - Optional search term to filter books
     * @returns The retrieved list of Books
     */
    getBooks(query?: string): Promise<Book[]>;
    /**
     * Gets all [[Collections]] the user has access to.
     *
     * @returns The retrieved list of Collections
     */
    getCollections(): Promise<Collection[]>;
    /**
     * Gets all [[Apps]] available for the user.
     *
     * @returns The retrieved list of Apps
     */
    getApps(): Promise<App[]>;
    /**
     * Gets all [[Templates]] available for the user.
     *
     * @returns The retrieved list of Templates
     */
    getTemplates(): Promise<Template[]>;
    /**
     * Gets the current logged [[User]].
     *
     * @returns The retrieved User
     */
    getUser(): Promise<User>;
    /**
     * Gets the URL to redirect the User to the billing portal.
     *
     * @param returnUrl - The URL to return to after the User has been redirected to the billing portal
     *
     * @returns The URL to redirect the User to the billing portal
     */
    getBillingPortalUrl(returnUrl: string): Promise<string | undefined>;
}

/**
 * A Book represents a [General Ledger](https://en.wikipedia.org/wiki/General_ledger) for a company or business, but can also represent a [Ledger](https://en.wikipedia.org/wiki/Ledger) for a project or department
 *
 * It contains all [[Accounts]] where [[Transactions]] are recorded/posted;
 *
 * @public
 */
export declare class Book extends ResourceProperty<bkper.Book> {
    private config?;
    private allGroupsLoaded;
    private allAccountsLoaded;








    constructor(payload?: bkper.Book, config?: Config);

    /**
     * Gets the unique identifier of this Book.
     *
     * @returns This Book's unique identifier
     */
    getId(): string;
    /**
     * Gets the name of this Book.
     *
     * @returns The name of this Book
     */
    getName(): string | undefined;
    /**
     * Sets the name of the Book.
     *
     * @param name - The name to set
     *
     * @returns This Book, for chaining
     */
    setName(name: string): Book;
    /**
     * Gets the number of fraction digits supported by this Book.
     *
     * @returns The number of fraction digits supported by this Book. Same as getDecimalPlaces
     */
    getFractionDigits(): number | undefined;
    /**
     * Gets the number of decimal places supported by this Book.
     *
     * @returns The number of decimal places supported by this Book. Same as getFractionDigits
     */
    getDecimalPlaces(): number | undefined;
    /**
     * Sets the number of fraction digits (decimal places) supported by this Book.
     *
     * @param fractionDigits - The number of fraction digits to set (0 to 8)
     *
     * @returns This Book, for chaining
     */
    setFractionDigits(fractionDigits: number): Book;
    /**
     * Gets the period slice for balances visualization.
     *
     * @returns The period slice for balances visualization
     */
    getPeriod(): Period;
    /**
     * Sets the period slice for balances visualization.
     *
     * @param period - The period to set
     *
     * @returns This Book, for chaining
     */
    setPeriod(period: Period): Book;
    /**
     * Gets the start month when YEAR period is set.
     *
     * @returns The start month when YEAR period is set
     */
    getPeriodStartMonth(): Month;
    /**
     * Sets the start month when YEAR period is set.
     *
     * @param month - The start month to set
     *
     * @returns This Book, for chaining
     */
    setPeriodStartMonth(month: Month): Book;
    /**
     * Gets the transactions pagination page size.
     *
     * @returns The transactions pagination page size
     */
    getPageSize(): number | undefined;
    /**
     * Sets the transactions pagination page size.
     *
     * @param pageSize - The page size to set
     *
     * @returns This Book, for chaining
     */
    setPageSize(pageSize: number): Book;
    /**
     * Gets the name of the owner of the Book.
     *
     * @returns The name of the owner of the Book
     */
    getOwnerName(): string | undefined;
    /**
     * Gets the permission for the current user in this Book.
     *
     * @returns The permission for the current user in this Book
     */
    getPermission(): Permission;
    /**
     * Gets the collection of this Book, if any.
     *
     * @returns The collection of this Book, if any
     */
    getCollection(): Collection | undefined;
    /**
     * Gets the date pattern of the Book.
     *
     * @returns The date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
     */
    getDatePattern(): string;
    /**
     * Sets the date pattern of the Book. Current: dd/MM/yyyy | MM/dd/yyyy | yyyy/MM/dd
     *
     * @param datePattern - The date pattern to set
     *
     * @returns This Book, for chaining
     */
    setDatePattern(datePattern: string): Book;
    /**
     * Gets the lock date of the Book in ISO format yyyy-MM-dd.
     *
     * @returns The lock date of the Book in ISO format yyyy-MM-dd
     */
    getLockDate(): string | undefined;
    /**
     * Sets the lock date of the Book in ISO format yyyy-MM-dd.
     *
     * @param lockDate - The lock date to set in ISO format yyyy-MM-dd
     *
     * @returns This Book, for chaining
     */
    setLockDate(lockDate: string | null): Book;
    /**
     * Gets the closing date of the Book in ISO format yyyy-MM-dd.
     *
     * @returns The closing date of the Book in ISO format yyyy-MM-dd
     */
    getClosingDate(): string | undefined;
    /**
     * Sets the closing date of the Book in ISO format yyyy-MM-dd.
     *
     * @param closingDate - The closing date to set in ISO format yyyy-MM-dd
     *
     * @returns This Book, for chaining
     */
    setClosingDate(closingDate: string | null): Book;
    /**
     * Gets the decimal separator of the Book.
     *
     * @returns The decimal separator of the Book
     */
    getDecimalSeparator(): DecimalSeparator;
    /**
     * Sets the decimal separator of the Book
     *
     * @param decimalSeparator - The decimal separator to set
     *
     * @returns This Book, for chaining
     */
    setDecimalSeparator(decimalSeparator: DecimalSeparator): Book;
    /**
     * Gets the time zone of the Book.
     *
     * @returns The time zone of the Book
     */
    getTimeZone(): string | undefined;
    /**
     * Sets the time zone of the Book.
     *
     * @param timeZone - The time zone to set
     *
     * @returns This Book, for chaining
     */
    setTimeZone(timeZone: string): Book;
    /**
     * Gets the time zone offset of the book, in minutes.
     *
     * @returns The time zone offset of the book, in minutes
     */
    getTimeZoneOffset(): number | undefined;
    /**
     * Gets the auto post status of the Book.
     *
     * @returns The auto post status of the Book
     */
    getAutoPost(): boolean | undefined;
    /**
     * Sets the auto post status of the Book.
     *
     * @param autoPost - The auto post status to set
     *
     * @returns This Book, for chaining
     */
    setAutoPost(autoPost: boolean): Book;
    /**
     * Gets the last update date of the book, in milliseconds.
     *
     * @returns The last update date of the book, in milliseconds
     */
    getLastUpdateMs(): number | undefined;
    /**
     * Gets the total number of posted transactions.
     *
     * @returns The total number of posted transactions
     */
    getTotalTransactions(): number;
    /**
     * Gets the total number of posted transactions on current month.
     *
     * @returns The total number of posted transactions on current month
     */
    getTotalTransactionsCurrentMonth(): number;
    /**
     * Gets the total number of posted transactions on current year.
     *
     * @returns The total number of posted transactions on current year
     */
    getTotalTransactionsCurrentYear(): number;
    /**
     * Gets the visibility of the book.
     *
     * @returns The visibility of the book
     */
    getVisibility(): Visibility;
    /**
     * Sets the visibility of the book.
     *
     * @param visibility - The visibility to set
     *
     * @returns This Book, for chaining
     */
    setVisibility(visibility: Visibility): Book;
    /**
     * Formats a date according to date pattern of the Book.
     *
     * @param date - The date to format as string.
     * @param timeZone - The output timezone of the result. Default to script's timeZone
     *
     * @returns The formatted date
     */
    formatDate(date: Date, timeZone?: string): string;
    /**
     * Parse a date string according to date pattern and timezone of the Book. Also parse ISO yyyy-mm-dd format.
     *
     * @param date - The date string to parse
     *
     * @returns The parsed Date object
     */
    parseDate(date: string): Date;
    /**
     * Formats a value according to [[DecimalSeparator]] and fraction digits of the Book.
     *
     * @param value - The value to be formatted.
     *
     * @returns The formatted value
     */
    formatValue(value: Amount | number | null | undefined): string;
    /**
     * Parse a value string according to [[DecimalSeparator]] and fraction digits of the Book.
     *
     * @param value - The value string to parse
     *
     * @returns The parsed Amount or undefined if parsing fails
     */
    parseValue(value: string): Amount | undefined;
    /**
     * Rounds a value according to the number of fraction digits of the Book.
     *
     * @param value - The value to be rounded
     *
     * @returns The rounded value
     */
    round(value: Amount | number): Amount;
    /**
     * Batch create [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be created
     *
     * @returns The created Transactions
     */
    batchCreateTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    /**
     * Batch post [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be posted
     */
    batchPostTransactions(transactions: Transaction[]): Promise<void>;
    /**
     * Batch update [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be updated
     *
     * @param updateChecked - True to also update checked transactions
     *
     * @returns The updated draft Transactions
     */
    batchUpdateTransactions(transactions: Transaction[], updateChecked?: boolean): Promise<Transaction[]>;
    /**
     * Batch check [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be checked
     */
    batchCheckTransactions(transactions: Transaction[]): Promise<void>;
    /**
     * Batch uncheck [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be unchecked
     */
    batchUncheckTransactions(transactions: Transaction[]): Promise<void>;
    /**
     * Batch trash [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be trashed
     * @param trashChecked - True to also trash checked transactions
     */
    batchTrashTransactions(transactions: Transaction[], trashChecked?: boolean): Promise<void>;
    /**
     * Batch untrash [[Transactions]] on the Book.
     *
     * @param transactions - The transactions to be untrashed
     */
    batchUntrashTransactions(transactions: Transaction[]): Promise<void>;
    /**
     * Replay [[Events]] on the Book, in batch.
     *
     * @param events - The events to be replayed
     * @param errorOnly - True to only replay events with errors
     */
    batchReplayEvents(events: Event[], errorOnly?: boolean): Promise<void>;
    /**
     * Create [[Accounts]] on the Book, in batch.
     *
     * @param accounts - The accounts to be created
     *
     * @returns The created Accounts
     */
    batchCreateAccounts(accounts: Account[]): Promise<Account[]>;
    /**
     * Create [[Groups]] on the Book, in batch.
     *
     * @param groups - The groups to be created
     *
     * @returns The created Groups
     */
    batchCreateGroups(groups: Group[]): Promise<Group[]>;
    /**
     * Trigger [Balances Audit](https://help.bkper.com/en/articles/4412038-balances-audit) async process.
     */
    audit(): void;
    /**
     * Retrieve installed [[Apps]] for this Book.
     *
     * @returns The retrieved Apps objects
     */
    getApps(): Promise<App[]>;
    /**
     * Gets the existing [[Integrations]] in the Book.
     *
     * @returns The retrieved Integration objects
     */
    getIntegrations(): Promise<Integration[]>;
    /**
     * Creates a new [[Integration]] in the Book.
     *
     * @param integration - The [[Integration]] object or wrapped plain json
     *
     * @returns The created [[Integration]] object
     */
    createIntegration(integration: bkper.Integration | Integration): Promise<Integration>;
    /**
     * Updates an existing [[Integration]] in the Book.
     *
     * @param integration - The [[Integration]] wrapped plain json
     *
     * @returns The updated [[Integration]] object
     */
    updateIntegration(integration: bkper.Integration): Promise<Integration>;
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
    getAccount(idOrName?: string): Promise<Account | undefined>;







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
    getGroup(idOrName?: string): Promise<Group | undefined>;
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
    getGroups(): Promise<Group[]>;

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
    getAccounts(): Promise<Account[]>;









    /**
     * Lists transactions in the Book based on the provided query, limit, and cursor, for pagination.
     *
     * @param query - The query string to filter transactions
     * @param limit - The maximum number of transactions to return. Default to 100, max to 1000
     * @param cursor - The cursor for pagination
     *
     * @returns A [[TransactionList]] object containing the list of transactions
     */
    listTransactions(query?: string, limit?: number, cursor?: string): Promise<TransactionList>;
    /**
     * Retrieve the number of transactions based on a query.
     *
     * @param query - The query string
     *
     * @returns The number of matching transactions
     */
    countTransactions(query?: string): Promise<number | undefined>;
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
    listEvents(afterDate: string | null, beforeDate: string | null, onError: boolean, resourceId: string | null, limit: number, cursor?: string): Promise<EventList>;
    /**
     * Retrieve a transaction by id.
     *
     * @param id - The transaction ID
     *
     * @returns The [[Transaction]] object
     */
    getTransaction(id: string): Promise<Transaction | undefined>;
    /**
     * Retrieve a file by id.
     *
     * @param id - The file ID
     *
     * @returns The [[File]] object
     */
    getFile(id: string): Promise<File | undefined>;
    /**
     * Performs create new Book.
     *
     * @returns The created Book object
     */
    create(): Promise<Book>;
    /**
     * Creates a copy of this Book
     *
     * @param name - The name for the copied book
     * @param copyTransactions - True to copy transactions from the source book (user must be the Book owner)
     * @param fromDate - Start date to consider if copying transactions (numeric value in YYYYMMDD format)
     *
     * @returns The copied Book object
     */
    copy(name: string, copyTransactions?: boolean, fromDate?: number): Promise<Book>;
    /**
     * Perform update Book, applying pending changes.
     *
     * @returns The updated Book object
     */
    update(): Promise<Book>;
    /**
     * Warning!
     *
     * Deletes this Book and all its data (transactions, accounts, groups). Book owner only.
     *
     * @returns This Book after deletion
     */
    remove(): Promise<Book>;
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
    getBalancesReport(query: string): Promise<BalancesReport>;
    /**
     * Gets the saved queries from this book.
     *
     * @returns The saved queries from this book
     */
    getSavedQueries(): Promise<Query[]>;
    /**
     * Gets all collaborators of this Book.
     *
     * @returns Array of Collaborator objects
     */
    getCollaborators(): Promise<Collaborator[]>;
    /**
     * Gets the Backlog of this Book.
     *
     * @returns The Backlog object
     */
    getBacklog(): Promise<Backlog>;
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
     * Gets the type of this Bot Response.
     *
     * @returns The type of this Bot Response
     */
    getType(): BotResponseType | undefined;
    /**
     * Gets the agent id of this Bot Response.
     *
     * @returns The agent id of this Bot Response
     */
    getAgentId(): string | undefined;
    /**
     * Gets the message of this Bot Response.
     *
     * @returns The message of this Bot Response
     */
    getMessage(): string | undefined;
    /**
     * Gets the date this Bot Response was created.
     *
     * @returns The date this Bot Response was created
     */
    getCreatedAt(): Date | undefined;
    /**
     * Gets the Event this Bot Response is associated to.
     *
     * @returns The Event this Bot Response is associated to
     */
    getEvent(): Event;
    /**
     * Replay this Bot Response.
     *
     * @returns The updated Bot Response
     */
    replay(): Promise<BotResponse>;
    /**
     * Delete this Bot Response.
     *
     * @returns The deleted Bot Response
     */
    remove(): Promise<BotResponse>;

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
 * This class defines a Collaborator of a [[Book]].
 *
 * A Collaborator represents a user that has been granted access to a Book with specific permissions.
 *
 * @public
 */
export declare class Collaborator extends Resource<bkper.Collaborator> {

    constructor(book: Book, payload?: bkper.Collaborator);

    /**
     * Gets the Collaborator internal id.
     *
     * @returns The Collaborator internal id
     */
    getId(): string | undefined;
    /**
     * Gets the Collaborator email address.
     *
     * @returns The Collaborator email address
     */
    getEmail(): string | undefined;
    /**
     * Sets the email address of the Collaborator.
     *
     * @param email - The email address to set
     *
     * @returns This Collaborator, for chaining
     */
    setEmail(email: string): Collaborator;
    /**
     * Gets the permission level of the Collaborator.
     *
     * @returns The permission level
     */
    getPermission(): Permission | undefined;
    /**
     * Sets the permission level of the Collaborator.
     *
     * @param permission - The permission level to set
     *
     * @returns This Collaborator, for chaining
     */
    setPermission(permission: Permission): Collaborator;
    /**
     * Performs create new Collaborator.
     *
     * @returns Promise with the created Collaborator
     */
    create(message?: string): Promise<Collaborator>;
    /**
     * Performs update Collaborator.
     *
     * @returns Promise with the updated Collaborator
     */
    update(): Promise<Collaborator>;
    /**
     * Performs remove Collaborator.
     *
     * @returns Promise with the removed Collaborator
     */
    remove(): Promise<Collaborator>;
}

/**
 * This class defines a Collection of [[Books]].
 *
 * @public
 */
export declare class Collection extends Resource<bkper.Collection> {
    private config?;
    constructor(payload?: bkper.Collection, config?: Config);

    /**
     * Gets the unique identifier of this Collection.
     *
     * @returns The id of this Collection
     */
    getId(): string | undefined;
    /**
     * Gets the name of this Collection.
     *
     * @returns The name of this Collection
     */
    getName(): string | undefined;
    /**
     * Sets the name of the Collection.
     *
     * @param name - The name to set
     *
     * @returns This Collection, for chaining
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
     * Gets all Books of this collection.
     *
     * @returns All Books of this collection
     */
    getBooks(): Book[];
    /**
     * Adds Books to this Collection.
     *
     * @param books - The Books to add to this Collection
     *
     * @returns The added Book objects
     */
    addBooks(books: Book[]): Promise<Book[]>;
    /**
     * Removes Books from this Collection.
     *
     * @param books - The Books to remove from this Collection
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
     * Provides the agent ID to identify the calling agent for attribution purposes.
     *
     * This ID is sent via the `bkper-agent-id` header with each API request,
     * allowing the server to attribute actions to the correct agent.
     */
    agentIdProvider?: () => Promise<string | undefined>;
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
export declare class Connection extends ResourceProperty<bkper.Connection> {
    private config?;
    constructor(payload?: bkper.Connection, config?: Config);

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
     * @returns The Connection, for chaining
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
     * @returns The Connection, for chaining
     */
    setName(name: string): Connection;
    /**
     * Sets the universal unique identifier of the Connection.
     *
     * @param uuid - The universal unique identifier of the Connection
     *
     * @returns The Connection, for chaining
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
     * @returns The Connection, for chaining
     */
    setType(type: "APP" | "BANK"): Connection;
    /**
     * Cleans any token property stored in the Connection.
     */
    clearTokenProperties(): void;
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
     * Gets an immutable copy of the JSON payload for this Event.
     *
     * @returns The wrapped plain json object
     */
    json(): bkper.Event;
    /**
     * Gets the book in which the Event was created.
     *
     * @returns The book in which the Event was created
     */
    getBook(): Book;
    /**
     * Gets the id of the Event.
     *
     * @returns The id of the Event
     */
    getId(): string | undefined;
    /**
     * Gets the user who performed the Event.
     *
     * @returns The user who performed the Event
     */
    getUser(): User | undefined;
    /**
     * Gets the Agent who performed the Event.
     *
     * @returns The Agent who performed the Event
     */
    getAgent(): Agent | undefined;
    /**
     * Gets the date the Event was created.
     *
     * @returns The date the Event was created
     */
    getCreatedAt(): Date | undefined;
    /**
     * Gets the type of the Event.
     *
     * @returns The type of the Event
     */
    getType(): EventType | undefined;
    /**
     * Gets the Bot Responses associated to this Event.
     *
     * @returns The Bot Responses associated to this Event
     */
    getBotResponses(): BotResponse[];
    /**
     * Checks if this Event has at least one Bot Response of type ERROR.
     *
     * @returns True if this Event has at least one Bot Response of type ERROR
     */
    hasErrorResponse(): boolean;

}

/**
 * A list associated with an event query.
 *
 * @public
 */
export declare class EventList {
    private payload;

    constructor(book: Book, payload: bkper.EventList);
    /**
     * Gets the cursor associated with the query for pagination.
     *
     * @returns The cursor associated with the query for pagination
     */
    getCursor(): string | undefined;
    /**
     * Gets the first Event in the list.
     *
     * @returns The first Event in the list
     */
    getFirst(): Event | undefined;
    /**
     * Get the total number of events in the list.
     *
     * @returns The total number of events
     */
    size(): number;
    /**
     * Get the events in the list.
     *
     * @returns An array of Event objects
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
    FILE_UPDATED = "FILE_UPDATED",
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
export declare class File extends ResourceProperty<bkper.File> {

    constructor(book: Book, payload?: bkper.File);
    /**
     * Gets the Book this File belongs to.
     *
     * @returns The Book instance that owns this File
     */
    getBook(): Book;

    /**
     * Gets the File id.
     *
     * @returns The File id
     */
    getId(): string | undefined;
    /**
     * Gets the File name.
     *
     * @returns The File name
     */
    getName(): string | undefined;
    /**
     * Sets the name of the File.
     *
     * @param name - The name to set
     *
     * @returns This File, for chaining
     */
    setName(name: string): File;
    /**
     * Gets the File content type.
     *
     * @returns The File content type
     */
    getContentType(): string | undefined;
    /**
     * Sets the File content type.
     *
     * @param contentType - The content type to set
     *
     * @returns This File, for chaining
     */
    setContentType(contentType: string): File;
    /**
     * Gets the file content Base64 encoded.
     *
     * @returns The file content Base64 encoded
     */
    getContent(): Promise<string | undefined>;
    /**
     * Sets the File content Base64 encoded.
     *
     * @param content - The content to set (Base64 encoded)
     *
     * @returns This File, for chaining
     */
    setContent(content: string): File;
    /**
     * Gets the file serving url for accessing via browser.
     *
     * @returns The file serving url
     */
    getUrl(): string | undefined;
    /**
     * Gets the file size in bytes.
     *
     * @returns The file size in bytes
     */
    getSize(): number | undefined;
    /**
     * Perform create new File.
     *
     * @returns The created File object
     */
    create(): Promise<File>;
    /**
     * Perform update File, applying pending changes.
     *
     * @returns The updated File object
     */
    update(): Promise<File>;
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
export declare class Group extends ResourceProperty<bkper.Group> {






    constructor(book: Book, payload?: bkper.Group);

    /**
     * Gets the id of this Group.
     *
     * @returns The id of this Group
     */
    getId(): string | undefined;
    /**
     * Gets the name of this Group.
     *
     * @returns The name of this Group
     */
    getName(): string | undefined;
    /**
     * Sets the name of the Group.
     *
     * @param name - The name to set
     *
     * @returns This Group, for chaining
     */
    setName(name: string): Group;
    /**
     * Tells if the balance of this Group has been verified/audited.
     *
     * @returns True if the balance of this Group has been verified/audited
     */
    isBalanceVerified(): Promise<boolean | undefined>;
    /**
     * Tells if the Group is locked by the Book owner.
     *
     * @returns True if the Group is locked
     */
    isLocked(): boolean;
    /**
     * Sets the locked state of the Group.
     *
     * @param locked - The locked state of the Group.
     *
     * @returns This Group, for chaining
     */
    setLocked(locked: boolean): Group;
    /**
     * Gets the normalized name of this group without spaces and special characters.
     *
     * @returns The name of this group without spaces and special characters
     */
    getNormalizedName(): string;
    /**
     * Gets all Accounts of this group.
     *
     * @returns All Accounts of this group
     */
    getAccounts(): Promise<Account[]>;
    /**
     * Gets the type of the accounts of this group.
     *
     * @returns The type for of the accounts of this group. Null if mixed
     */
    getType(): AccountType;
    /**
     * Tells if the Group is hidden on main transactions menu.
     *
     * @returns True if the Group is hidden, false otherwise
     */
    isHidden(): boolean | undefined;
    /**
     * Hide/Show group on main menu.
     *
     * @param hidden - Whether to hide the group
     *
     * @returns This Group, for chaining
     */
    setHidden(hidden: boolean): Group;
    /**
     * Tells if this is a credit (Incoming and Liabilities) group.
     *
     * @returns True if this is a credit group
     */
    isCredit(): boolean | undefined;
    /**
     * Tells if this is a mixed (Assets/Liabilities or Incoming/Outgoing) group.
     *
     * @returns True if this is a mixed group
     */
    isMixed(): boolean | undefined;
    /**
     * Tells if the Group is permanent.
     *
     * @returns True if the Group is permanent
     */
    isPermanent(): boolean | undefined;
    /**
     * Gets the parent Group.
     *
     * @returns The parent Group
     */
    getParent(): Group | undefined;
    /**
     * Sets the parent Group.
     *
     * @param group - The parent Group to set
     *
     * @returns This Group, for chaining
     */
    setParent(group: Group | null | undefined): Group;
    /**
     * Checks if the Group has a parent.
     *
     * @returns True if the Group has a parent, otherwise false
     */
    hasParent(): boolean;
    /**
     * Gets the children of the Group.
     *
     * @returns An array of child Groups
     */
    getChildren(): Group[];

    /**
     * Gets all descendant Groups of the current Group.
     *
     * @returns A set of descendant Groups
     */
    getDescendants(): Set<Group>;
    /**
     * Gets the IDs of all descendant Groups in a tree structure.
     *
     * @returns A set of descendant Group IDs
     */
    getDescendantTreeIds(): Set<string>;
    /**
     * Checks if the Group has any children.
     *
     * @returns True if the Group has children, otherwise false
     */
    hasChildren(): boolean;
    /**
     * Checks if the Group is a leaf node (i.e., has no children).
     *
     * @returns True if the Group is a leaf, otherwise false
     */
    isLeaf(): boolean;
    /**
     * Checks if the Group is a root node (i.e., has no parent).
     *
     * @returns True if the Group is a root, otherwise false
     */
    isRoot(): boolean;
    /**
     * Gets the depth of the Group in the hierarchy.
     *
     * @returns The depth of the Group
     */
    getDepth(): number;
    /**
     * Gets the root Group of the current Group.
     *
     * @returns The root Group
     */
    getRoot(): Group;
    /**
     * Gets the name of the root Group.
     *
     * @returns The name of the root Group
     */
    getRootName(): string;



    /**
     * Tells if this group has any account in it.
     *
     * @returns True if this group has any account in it
     */
    hasAccounts(): boolean | undefined;
    /**
     * Performs create new group.
     *
     * @returns A promise that resolves to this Group
     */
    create(): Promise<Group>;
    /**
     * Performs update group, applying pending changes.
     *
     * @returns A promise that resolves to this Group
     */
    update(): Promise<Group>;
    /**
     * Performs delete group.
     *
     * @returns A promise that resolves to this Group
     */
    remove(): Promise<Group>;

}

/**
 * This class defines a Integration from an [[User]] to an external service.
 *
 * @public
 */
export declare class Integration extends ResourceProperty<bkper.Integration> {
    private config?;
    constructor(payload?: bkper.Integration, config?: Config);

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
     *
     * @deprecated Use getLogoUrl instead.
     */
    getLogo(): string | undefined;
    /**
     * Gets the logo url of this Integration.
     *
     * @returns The logo url of this Integration
     */
    getLogoUrl(): string | undefined;
    /**
     * Gets the logo url of this Integration in dark mode.
     *
     * @returns The logo url of this Integration in dark mode
     */
    getLogoUrlDark(): string | undefined;
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
     * Performs remove Integration.
     *
     * @returns The removed Integration object
     */
    remove(): Promise<Integration>;
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
export declare class Query extends Resource<bkper.Query> {

    constructor(book: Book, payload?: bkper.Query);

    /**
     * Gets the Query universal identifier.
     *
     * @returns The Query universal identifier
     */
    getId(): string | undefined;
    /**
     * Gets the title of this saved Query.
     *
     * @returns The title of this saved Query
     */
    getTitle(): string | undefined;
    /**
     * Sets the title of this saved Query.
     *
     * @param title - The title of this saved Query
     *
     * @returns This Query, for chaining
     */
    setTitle(title: string): Query;
    /**
     * Gets the query string to be executed.
     *
     * @returns This Query string to be executed
     */
    getQuery(): string | undefined;
    /**
     * Sets the query string associated with this saved Query.
     *
     * @param query - The query string to be executed
     *
     * @returns This Query, for chaining
     */
    setQuery(query: string): Query;
    /**
     * Perform create new Query.
     *
     * @returns This Query, for chaining
     */
    create(): Promise<Query>;
    /**
     * Perform update Query, applying pending changes.
     *
     * @returns This Query, for chaining
     */
    update(): Promise<Query>;
    /**
     * Perform delete Query.
     *
     * @returns This Query, for chaining
     */
    remove(): Promise<Query>;

}

/**
 * Abstract base class for all Bkper resources.
 * Provides common functionality for config management and JSON serialization.
 *
 * @public
 */
declare abstract class Resource<T = any> {
    /**
     * The underlying payload data for this resource
     */
    payload: T;
    /**
     * Constructs a new Resource
     * @param payload - The data payload for this resource
     */
    constructor(payload?: T);
    /**
     * Gets an immutable copy of the JSON payload for this resource.
     * @returns An immutable copy of the json payload
     */
    json(): T;

}

/**
 * Abstract base class for Bkper resources that support custom properties.
 *
 * Extends Resource<T> and adds property management methods for entities
 * that have a properties field in their payload.
 *
 * @public
 */
declare abstract class ResourceProperty<T extends {
    properties?: {
        [key: string]: string;
    };
}> extends Resource<T> {

    /**
     * Gets the custom properties stored in this resource.
     *
     * @returns Object with key/value pair properties
     */
    getProperties(): {
        [key: string]: string;
    };
    /**
     * Sets the custom properties of this resource.
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This resource, for chaining
     */
    setProperties(properties: {
        [key: string]: string;
    }): this;
    /**
     * Gets the property value for given keys. First property found will be retrieved.
     *
     * @param keys - The property keys to search for
     *
     * @returns The property value or undefined if not found
     */
    getProperty(...keys: string[]): string | undefined;
    /**
     * Sets a custom property in this resource.
     *
     * @param key - The property key
     * @param value - The property value, or null/undefined to clean it
     *
     * @returns This resource, for chaining
     */
    setProperty(key: string, value: string | null | undefined): this;
    /**
     * Deletes a custom property.
     *
     * @param key - The property key
     *
     * @returns This resource, for chaining
     */
    deleteProperty(key: string): this;
    /**
     * Gets the custom properties keys stored in this resource.
     *
     * @returns Array of property keys sorted alphabetically
     */
    getPropertyKeys(): string[];
    /**
     * Sets a custom property in this resource, filtering out hidden properties.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param key - The property key
     * @param value - The property value, or null/undefined to clean it
     *
     * @returns This resource, for chaining
     */
    setVisibleProperty(key: string, value: string | null | undefined): this;
    /**
     * Sets the custom properties of this resource, filtering out hidden properties.
     * Hidden properties are those whose keys end with an underscore "_".
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This resource, for chaining
     */
    setVisibleProperties(properties: {
        [key: string]: string;
    }): this;
    /**
     * Gets the visible custom properties stored in this resource.
     * Hidden properties (those ending with "_") are excluded from the result.
     *
     * @returns Object with key/value pair properties, excluding hidden properties
     */
    getVisibleProperties(): {
        [key: string]: string;
    };
}

/**
 * This class defines a Template.
 *
 * A Template is a pre-configured setup for [[Books]] and associated Google Sheets that provides users with a starting point for specific accounting or financial management needs.
 *
 * @public
 */
export declare class Template extends Resource<bkper.Template> {
    private config?;
    constructor(json?: bkper.Template, config?: Config);

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
export declare class Transaction extends ResourceProperty<bkper.Transaction> {


    constructor(book: Book, payload?: bkper.Transaction);

    /**
     * Gets the book associated with this transaction.
     *
     * @returns The book of the Transaction
     */
    getBook(): Book;
    /**
     * Gets the unique identifier of the transaction.
     *
     * @returns The id of the Transaction
     */
    getId(): string | undefined;
    /**
     * Gets the unique identifier of the agent that created this transaction.
     *
     * @returns The id of the agent that created this transaction
     */
    getAgentId(): string | undefined;
    /**
     * Gets the name of the agent that created this transaction.
     *
     * @returns The name of the agent that created this transaction
     */
    getAgentName(): string | undefined;
    /**
     * Gets the logo URL of the agent that created this transaction.
     *
     * @returns The logo of the agent that created this transaction
     */
    getAgentLogoUrl(): string | undefined;
    /**
     * Gets the dark mode logo URL of the agent that created this transaction.
     *
     * @returns The logo of the agent that created this transaction in dark mode
     */
    getAgentLogoUrlDark(): string | undefined;
    /**
     * Gets the remote IDs associated with this transaction. Remote ids are used to avoid duplication.
     *
     * @returns The remote ids of the Transaction
     */
    getRemoteIds(): string[];
    /**
     * Add a remote id to the Transaction.
     *
     * @param remoteId - The remote id to add
     *
     * @returns This Transaction, for chaining
     */
    addRemoteId(remoteId: string): Transaction;
    /**
     * Checks if the transaction has been posted to the accounts.
     *
     * @returns True if transaction was already posted to the accounts. False if is still a Draft
     */
    isPosted(): boolean | undefined;
    /**
     * Checks if the transaction is marked as checked.
     *
     * @returns True if transaction is checked
     */
    isChecked(): boolean | undefined;
    /**
     * Set the check state of the Transaction.
     *
     * @param checked - The check state
     *
     * @returns This Transaction, for chaining
     */
    setChecked(checked: boolean): Transaction;
    /**
     * Checks if the transaction is in the trash.
     *
     * @returns True if transaction is in trash
     */
    isTrashed(): boolean | undefined;
    /**
     * Checks if the transaction is locked by the book's lock or closing date.
     *
     * @returns True if a transaction is locked by the book lock/closing date
     */
    isLocked(): boolean;
    /**
     * Gets all hashtags used in the transaction.
     *
     * @returns All #hashtags used on the transaction
     */
    getTags(): string[];
    /**
     * Gets all URLs associated with the transaction.
     *
     * @returns All urls of the transaction
     */
    getUrls(): string[];
    /**
     * Sets the Transaction urls. Url starts with https://
     *
     * @param urls - The urls array
     *
     * @returns This Transaction, for chaining
     */
    setUrls(urls: string[]): Transaction;
    /**
     * Add a url to the Transaction. Url starts with https://
     *
     * @param url - The url to add
     *
     * @returns This Transaction, for chaining
     */
    addUrl(url: string): Transaction;
    /**
     * Gets all files attached to the transaction.
     *
     * @returns The files attached to the transaction
     */
    getFiles(): File[];
    /**
     * Removes a file attachment from the Transaction.
     *
     * @param file - The File to remove from this Transaction
     *
     * @returns This Transaction, for chaining
     */
    removeFile(file: File): Transaction;
    /**
     * Adds a file attachment to the Transaction.
     *
     * Files not previously created in the Book will be automatically created when the transaction is persisted.
     *
     * @param file - The File to add to this Transaction
     *
     * @returns This Transaction, for chaining
     */
    addFile(file: File): Transaction;

    /**
     * Check if the transaction has the specified tag.
     *
     * @param tag - The tag to check for
     *
     * @returns True if the transaction has the specified tag
     */
    hasTag(tag: string): boolean;
    /**
     * Gets the credit account associated with this Transaction. Same as origin account
     *
     * @returns The credit (origin) account
     */
    getCreditAccount(): Promise<Account | undefined>;
    /**
     * Gets the name of this Transaction's credit account.
     *
     * @returns The credit account name
     */
    getCreditAccountName(): Promise<string | undefined>;
    /**
     * Sets the credit/origin [[Account]] of this Transaction. Same as from()
     *
     * @param account - The Account object, or null/undefined to clear
     *
     * @returns This Transaction, for chaining
     */
    setCreditAccount(account: Account | bkper.Account | null | undefined): Transaction;
    /**
     * Sets the credit/origin [[Account]] of this Transaction. Same as setCreditAccount()
     *
     * @param account - The Account object, or null/undefined to clear
     *
     * @returns This Transaction, for chaining
     */
    from(account: Account | bkper.Account | null | undefined): Transaction;
    /**
     * Gets the debit account associated with this Transaction. Same as destination account
     *
     * @returns The debit (destination) account
     */
    getDebitAccount(): Promise<Account | undefined>;
    /**
     * Gets the name of this Transaction's debit account.
     *
     * @returns The debit account name
     */
    getDebitAccountName(): Promise<string | undefined>;
    /**
     * Sets the debit/destination [[Account]] of this Transaction. Same as to()
     *
     * @param account - The Account object, or null/undefined to clear
     *
     * @returns This Transaction, for chaining
     */
    setDebitAccount(account: Account | bkper.Account | null | undefined): Transaction;
    /**
     * Sets the debit/destination [[Account]] of this Transaction. Same as setDebitAccount()
     *
     * @param account - The Account object, or null/undefined to clear
     *
     * @returns This Transaction, for chaining
     */
    to(account: Account | bkper.Account | null | undefined): Transaction;
    /**
     * Gets the amount of this Transaction.
     *
     * @returns The amount of this Transaction
     */
    getAmount(): Amount | undefined;
    /**
     * Gets the formatted amount of this Transaction according to the Book format.
     *
     * @returns The amount of this Transaction, formatted according to the Book format
     */
    getAmountFormatted(): string | undefined;
    /**
     * Sets the amount of this Transaction.
     *
     * @param amount - The amount to set
     *
     * @returns This Transaction, for chaining
     */
    setAmount(amount: Amount | number | string): Transaction;
    /**
     * Get the absolute amount of this Transaction if the given account is at the credit side.
     *
     * @param account - The account object, id or name
     *
     * @returns The credit amount or undefined
     */
    getCreditAmount(account: Account | string): Promise<Amount | undefined>;
    /**
     * Gets the absolute amount of this Transaction if the given account is at the debit side.
     *
     * @param account - The account object, id or name
     *
     * @returns The debit amount or undefined
     */
    getDebitAmount(account: Account | string): Promise<Amount | undefined>;
    /**
     * Gets the [[Account]] at the other side of the transaction given the one in one side.
     *
     * @param account - The account object, id or name
     *
     * @returns The account at the other side of the transaction
     */
    getOtherAccount(account: Account | string): Promise<Account | undefined>;
    /**
     * The Account name at the other side of this Transaction given the one in one side.
     *
     * @param account - The Account object, id or name
     *
     * @returns The name of the Account at the other side
     */
    getOtherAccountName(account: string | Account): Promise<string | undefined>;
    /**
     * Tell if the given account is credit on this Transaction
     *
     * @param account - The Account object
     *
     * @returns True if the account is the credit account
     */
    isCredit(account?: Account): Promise<boolean>;
    /**
     * Tell if the given account is debit on the Transaction
     *
     * @param account - The [[Account]] object
     *
     * @returns True if the Account is the debit account
     */
    isDebit(account?: Account): Promise<boolean>;

    /**
     * Gets the description of this Transaction.
     *
     * @returns The description of this Transaction
     */
    getDescription(): string;
    /**
     * Sets the description of the Transaction.
     *
     * @param description - The description to set
     *
     * @returns This Transaction, for chaining
     */
    setDescription(description: string): Transaction;
    /**
     * Gets the transaction date in ISO format.
     *
     * @returns The Transaction date, in ISO format yyyy-MM-dd
     */
    getDate(): string | undefined;
    /**
     * Sets the date of the Transaction.
     *
     * @param date - The date to set as string or Date object
     *
     * @returns This Transaction, for chaining
     */
    setDate(date: string | Date): Transaction;
    /**
     * Gets the transaction date as a Date object in the book's timezone.
     *
     * @returns The Transaction Date object, on the time zone of the [[Book]]
     */
    getDateObject(): Date;
    /**
     * Gets the transaction date as a numeric value.
     *
     * @returns The Transaction date number, in format YYYYMMDD
     */
    getDateValue(): number | undefined;
    /**
     * Gets the transaction date formatted according to the book's date pattern.
     *
     * @returns The Transaction date, formatted on the date pattern of the [[Book]]
     */
    getDateFormatted(): string | undefined;
    /**
     * Gets the date when the transaction was created.
     *
     * @returns The date the transaction was created
     */
    getCreatedAt(): Date;
    /**
     * Gets the formatted creation date of the transaction.
     *
     * @returns The date the transaction was created, formatted according to the date pattern of the [[Book]]
     */
    getCreatedAtFormatted(): string;
    /**
     * Gets the username of the user who created the transaction.
     *
     * @returns The username of the user who created the transaction
     */
    getCreatedBy(): string | undefined;
    /**
     * Gets the date when the transaction was last updated.
     *
     * @returns The date the transaction was last updated
     */
    getUpdatedAt(): Date;
    /**
     * Gets the formatted last update date of the transaction.
     *
     * @returns The date the transaction was last updated, formatted according to the date pattern of the [[Book]]
     */
    getUpdatedAtFormatted(): string;


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
    getAccountBalance(raw?: boolean): Promise<Amount | undefined>;
    /**
     * Perform create new draft transaction.
     *
     * @returns This Transaction, for chaining
     */
    create(): Promise<Transaction>;
    /**
     * Update transaction, applying pending changes.
     *
     * @returns This Transaction, for chaining
     */
    update(): Promise<Transaction>;
    /**
     * Perform check transaction.
     *
     * @returns This Transaction, for chaining
     */
    check(): Promise<Transaction>;
    /**
     * Perform uncheck transaction.
     *
     * @returns This Transaction, for chaining
     */
    uncheck(): Promise<Transaction>;
    /**
     * Perform post transaction, changing credit and debit [[Account]] balances.
     *
     * @returns This Transaction, for chaining
     */
    post(): Promise<Transaction>;
    /**
     * Trash the transaction.
     *
     * @returns This Transaction, for chaining
     */
    trash(): Promise<Transaction>;
    /**
     * Untrash the transaction.
     *
     * @returns This Transaction, for chaining
     */
    untrash(): Promise<Transaction>;
}

/**
 * A list associated with a transaction query.
 *
 * @public
 */
export declare class TransactionList {
    private payload;

    constructor(book: Book, payload: bkper.TransactionList);
    /**
     * Gets the cursor associated with the query for pagination.
     *
     * @returns The cursor associated with the query for pagination
     */
    getCursor(): string | undefined;
    /**
     * Retrieves the account associated with the query, when filtering by account.
     *
     * @returns The account associated with the query, or undefined if not set
     */
    getAccount(): Promise<Account | undefined>;
    /**
     * Gets the first Transaction in the list.
     *
     * @returns The first Transaction in the list
     */
    getFirst(): Transaction | undefined;
    /**
     * Gets the total number of transactions in the list.
     *
     * @returns The total number of transactions
     */
    size(): number;
    /**
     * Gets the transactions in the list.
     *
     * @returns An array of Transaction objects
     */
    getItems(): Transaction[];
}

/**
 * This class defines a User on the Bkper platform.
 *
 * Users can own and collaborate on [[Books]], manage [[Collections]], and connect to external services through [[Connections]].
 *
 * Each User has a unique identity, subscription plan details, and access permissions across the platform.
 *
 * @public
 */
export declare class User extends Resource<bkper.User> {
    private config?;
    constructor(payload?: bkper.User, config?: Config);

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
     * Gets the username of the User.
     *
     * @returns The User's username
     */
    getUsername(): string | undefined;
    /**
     * Gets the billing information for this User.
     *
     * @returns The User's billing information
     */
    getBilling(): Promise<Billing>;
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
