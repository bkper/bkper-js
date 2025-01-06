import { Account } from "./Account";
import { Amount } from "./Amount";
import { BalancesReport } from "./BalancesReport";
import { Group } from "./Group";

/**
 * The container of balances of an [[Account]] or [[Group]]
 * 
 * The container is composed of a list of [[Balances]] for a window of time, as well as its period and cumulative totals.
 * 
 * @public
 */
export interface BalancesContainer {

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
