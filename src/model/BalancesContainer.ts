import { Account } from "./Account.js";
import { Amount } from "./Amount.js";
import { Balance } from "./Balance.js";
import { BalancesDataTableBuilder } from "./BalancesDataTableBuilder.js";
import { BalancesReport } from "./BalancesReport.js";
import { Group } from "./Group.js";

/**
 * The container of balances of an [[Account]] or [[Group]]
 * 
 * The container is composed of a list of [[Balances]] for a window of time, as well as its period and cumulative totals.
 * 
 * @public
 */
export interface BalancesContainer {

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
    getProperties(): { [key: string]: string };

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
