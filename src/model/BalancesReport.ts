import { normalizeName } from '../utils.js';
import { BalancesContainer } from "./BalancesContainer.js";
import { AccountBalancesContainer } from "./BalancesContainerAccount.js";
import { GroupBalancesContainer } from "./BalancesContainerGroup.js";
import { BalancesDataTableBuilder } from './BalancesDataTableBuilder.js';
import { Book } from "./Book.js";
import { Periodicity } from "./Enums.js";

/**
 * Class representing a Balance Report, generated when calling [Book.getBalanceReport](#book_getbalancesreport)
 * 
 * @public
 */
export class BalancesReport {

    public payload: bkper.Balances;

    /** @internal */
    private book: Book;

    /** @internal */
    private groupBalancesContainers?: GroupBalancesContainer[];

    /** @internal */
    private accountBalancesContainers?: AccountBalancesContainer[];

    /** @internal */
    private balancesContainersMap?: Map<string, BalancesContainer>;

    constructor(book: Book, payload: bkper.Balances) {
        this.book = book;
        this.payload = payload;
    }

    /**
     * Gets the [[Book]] that generated the report.
     *
     * @returns The [[Book]] that generated the report
     */
    public getBook(): Book {
        return this.book;
    }

    /**
     * Creates a BalancesDataTableBuilder to generate a two-dimensional array with all [[BalancesContainers]].
     */
    public createDataTable(): BalancesDataTableBuilder {
        return new BalancesDataTableBuilder(this.book, this.getBalancesContainers(), this.getPeriodicity());
    }

    /**
     * Gets the [[Periodicity]] of the query used to generate the report.
     *
     * @returns The [[Periodicity]] of the query used to generate the report
     */
    public getPeriodicity(): Periodicity {
        return this.payload.periodicity as Periodicity;
    }

    /**
     * Gets all [[BalancesContainers]] of the report.
     *
     * @returns All [[BalancesContainers]] of the report
     */
    public getBalancesContainers(): BalancesContainer[] {
        let containers: BalancesContainer[] = [];
        const accountContainers = this.getRootAccountBalancesContainers();
        if (accountContainers != null && accountContainers.length > 0) {
            containers = containers.concat(accountContainers);
        }
        const groupContainers = this.getGroupBalancesContainers();
        if (groupContainers != null && groupContainers.length > 0) {
            containers = containers.concat(groupContainers);
        }
        return containers;
    }

    /**
     * Gets a specific [[BalancesContainer]].
     * 
     * @param name - The [[Account]] or [[Group]] name
     * 
     * @returns The retrieved [[BalancesContainer]]
     */
    public getBalancesContainer(name: string): BalancesContainer {

        const normalizedName = normalizeName(name);

        const rootContainers = this.getBalancesContainers();
        if (rootContainers == null || rootContainers.length === 0) {
            throw `${name} not found`;
        }

        if (this.balancesContainersMap == null) {
            this.balancesContainersMap = this.fillBalancesContainersMap(new Map<string, BalancesContainer>(), rootContainers);
        }

        const balancesContainer = this.balancesContainersMap?.get(normalizedName);
        if (!balancesContainer) {
            throw `${name} not found`;
        }

        return balancesContainer;
    }

    /** @internal */
    private getRootAccountBalancesContainers(): AccountBalancesContainer[] {
        if (this.accountBalancesContainers == null && this.payload.accountBalances != null) {
            this.accountBalancesContainers = [];
            for (let i = 0; i < this.payload.accountBalances.length; i++) {
                const accountBalances = this.payload.accountBalances[i];
                const accountBalancesContainer = new AccountBalancesContainer(null, this, accountBalances);
                this.accountBalancesContainers.push(accountBalancesContainer);
            }
        }
        return this.accountBalancesContainers || [];
    }

    /** @internal */
    private getGroupBalancesContainers(): GroupBalancesContainer[] {
        if (this.groupBalancesContainers == null && this.payload.groupBalances != null) {
            this.groupBalancesContainers = [];
            for (let i = 0; i < this.payload.groupBalances.length; i++) {
                const groupBalances = this.payload.groupBalances[i];
                const groupBalancesContainer = new GroupBalancesContainer(null, this, groupBalances);
                this.groupBalancesContainers.push(groupBalancesContainer);
            }
        }
        return this.groupBalancesContainers || [];
    }

    /** @internal */
    private fillBalancesContainersMap(map: Map<string, BalancesContainer>, containers: BalancesContainer[]): Map<string, BalancesContainer> {
        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            const normalizedName = container.getNormalizedName();
            if (normalizedName) {
                if (!map.has(normalizedName)) {
                    map.set(normalizedName, container);
                }
            }
            const nextContainers = container.getBalancesContainers();
            if (nextContainers && nextContainers.length > 0) {
                this.fillBalancesContainersMap(map, nextContainers);
            }
        }
        return map;
    }

}
