import { getRepresentativeValue, normalizeName } from "../utils.js";
import { Account } from "./Account.js";
import { Amount } from "./Amount.js";
import { BalancesContainer } from "./BalancesContainer.js";
import { BalancesReport } from "./BalancesReport.js";
import { Group } from "./Group.js";

/** @internal */
export class AccountBalancesContainer implements BalancesContainer {

    /** @internal */
    private parent: BalancesContainer | null;

    /** @internal */
    private balancesReport: BalancesReport;

    /** @internal */
    private payload: bkper.AccountBalances;

    /** @internal */
    private depth?: number;

    constructor(parent: BalancesContainer | null, balancesReport: BalancesReport, payload: bkper.AccountBalances) {
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
        return null;
    }

    public async getAccount(): Promise<Account | null> {
        const account = await this.balancesReport.getBook().getAccount(this.getNormalizedName());
        return account || null;
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
        return true;
    }

    public isFromGroup(): boolean {
        return false;
    }

    public hasGroupBalances(): boolean {
        return false;
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
        return [];
    }

    public getBalancesContainer(name: string): BalancesContainer {
        const normalizedName = normalizeName(name);
        if (this.getNormalizedName() == normalizedName) {
            return this;
        }
        throw `${name} does not match ${this.getName()}`;
    }

}
