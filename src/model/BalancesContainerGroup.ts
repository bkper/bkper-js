import { Account } from "./Account.js";
import { Group } from "./Group.js";
import { BalancesContainer } from "./BalancesContainer.js";
import { BalancesReport } from "./BalancesReport.js";
import { Amount } from "./Amount.js";
import { getRepresentativeValue, normalizeName } from "../utils.js";
import { AccountBalancesContainer } from "./BalancesContainerAccount.js";

/** @internal */
export class GroupBalancesContainer implements BalancesContainer {

    /** @internal */
    private parent: BalancesContainer | null;

    /** @internal */
    private balancesReport: BalancesReport;

    /** @internal */
    private payload: bkper.GroupBalances;

    /** @internal */
    private depth?: number;

    /** @internal */
    private groupBalances?: GroupBalancesContainer[];

    /** @internal */
    private accountBalances?: AccountBalancesContainer[];

    /** @internal */
    private balancesContainersMap?: Map<string, BalancesContainer>;

    constructor(parent: BalancesContainer | null, balancesReport: BalancesReport, payload: bkper.GroupBalances) {
        this.parent = parent;
        this.balancesReport = balancesReport;
        this.payload = payload;
    }

    public getBalancesReport(): BalancesReport {
        return this.balancesReport;
    }

    public getName(): string | undefined {
        return this.payload.name;
    }

    public getNormalizedName(): string | undefined {
        return this.payload.normalizedName;
    }

    public async getGroup(): Promise<Group | null> {
        const group = await this.balancesReport.getBook().getGroup(this.getNormalizedName());
        return group || null;
    }

    public async getAccount(): Promise<Account | null> {
        return null;
    }

    public getParent(): BalancesContainer | null {
        return this.parent;
    }

    public getDepth(): number {
        if (this.depth == null) {
            const parent = this.getParent();
            this.depth = parent != null ? parent.getDepth() + 1 : 0;
        }
        return this.depth;
    }

    public isCredit(): boolean | undefined {
        return this.payload.credit;
    }

    public isPermanent(): boolean | undefined {
        return this.payload.permanent;
    }

    public isFromAccount(): boolean {
        return false;
    }

    public isFromGroup(): boolean {
        return true;
    }

    public hasGroupBalances(): boolean {
        const groupContainers = this.getGroupContainers();
        return groupContainers != null && groupContainers.length > 0;
    }

    public getCumulativeBalance(): Amount {
        return getRepresentativeValue(new Amount(this.payload.cumulativeBalance || 0), this.isCredit());
    }

    public getCumulativeBalanceRaw(): Amount {
        return new Amount(this.payload.cumulativeBalance || 0);
    }

    public getCumulativeBalanceText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
    }

    public getCumulativeBalanceRawText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeBalanceRaw());
    }

    public getPeriodBalance(): Amount {
        return getRepresentativeValue(new Amount(this.payload.periodBalance || 0), this.isCredit());
    }

    public getPeriodBalanceRaw(): Amount {
        return new Amount(this.payload.periodBalance || 0);
    }

    public getPeriodBalanceText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
    }

    public getPeriodBalanceRawText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodBalanceRaw());
    }

    public getBalancesContainers(): BalancesContainer[] {
        let containers: BalancesContainer[] = [];
        const groupContainers = this.getGroupContainers();
        if (groupContainers && groupContainers.length > 0) {
            containers = containers.concat(groupContainers);
        }
        const accountContainers = this.getAccountContainers();
        if (accountContainers && accountContainers.length > 0) {
            containers = containers.concat(accountContainers);
        }
        return containers;
    }

    /** @internal */
    private getGroupContainers(): GroupBalancesContainer[] {
        let groupBalances = this.payload.groupBalances;
        if (this.groupBalances == null && groupBalances != null) {
            this.groupBalances = [];
            for (let i = 0; i < groupBalances.length; i++) {
                const groupBalance = groupBalances[i];
                this.groupBalances.push(new GroupBalancesContainer(this, this.balancesReport, groupBalance));
            }
        }
        return this.groupBalances || [];
    }

    /** @internal */
    private getAccountContainers(): AccountBalancesContainer[] {
        let accountBalances = this.payload.accountBalances;
        if (this.accountBalances == null && accountBalances != null) {
            this.accountBalances = [];
            for (let i = 0; i < accountBalances.length; i++) {
                const accountBalance = accountBalances[i];
                this.accountBalances.push(new AccountBalancesContainer(this, this.balancesReport, accountBalance));
            }
        }
        return this.accountBalances || [];
    }

    public getBalancesContainer(name: string): BalancesContainer {

        const normalizedName = normalizeName(name);

        const rootContainers = this.getBalancesContainers();
        if (rootContainers == null || rootContainers.length === 0) {
            throw `${name} not found on group ${this.getName()}`;
        }

        if (this.balancesContainersMap == null) {
            this.balancesContainersMap = this.fillBalancesContainersMap(new Map<string, BalancesContainer>(), rootContainers);
        }

        const balancesContainer = this.balancesContainersMap?.get(normalizedName);
        if (!balancesContainer) {
            throw `${name} not found on group ${this.getName()}`;
        }

        return balancesContainer;
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
