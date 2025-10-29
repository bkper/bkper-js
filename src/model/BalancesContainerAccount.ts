import { getRepresentativeValue, normalizeName } from "../utils.js";
import { Account } from "./Account.js";
import { Amount } from "./Amount.js";
import { Balance } from "./Balance.js";
import { BalancesContainer } from "./BalancesContainer.js";
import { BalancesDataTableBuilder } from "./BalancesDataTableBuilder.js";
import { BalancesReport } from "./BalancesReport.js";
import { Group } from "./Group.js";

/** @internal */
export class AccountBalancesContainer implements BalancesContainer {

    public payload: bkper.AccountBalances;

    /** @internal */
    private parent: BalancesContainer | null;

    /** @internal */
    private balancesReport: BalancesReport;

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

    public getName(): string {
        return this.payload.name!;
    }

    public getNormalizedName(): string {
        return this.payload.normalizedName!;
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

    public isPermanent(): boolean {
        return this.payload.permanent || false;
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

    public getCumulativeCredit(): Amount {
        return new Amount(this.payload.cumulativeCredit || 0);
    }

    public getCumulativeDebit(): Amount {
        return new Amount(this.payload.cumulativeDebit || 0);
    }

    public getCumulativeBalanceText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeBalance());
    }

    public getCumulativeBalanceRawText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeBalanceRaw());
    }

    public getCumulativeCreditText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeCredit());
    }

    public getCumulativeDebitText(): string {
        return this.balancesReport.getBook().formatValue(this.getCumulativeDebit());
    }

    public getPeriodBalance(): Amount {
        return getRepresentativeValue(new Amount(this.payload.periodBalance || 0), this.isCredit());
    }

    public getPeriodBalanceRaw(): Amount {
        return new Amount(this.payload.periodBalance || 0);
    }

    public getPeriodCredit(): Amount {
        return new Amount(this.payload.periodCredit || 0);
    }

    public getPeriodDebit(): Amount {
        return new Amount(this.payload.periodDebit || 0);
    }

    public getPeriodBalanceText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodBalance());
    }

    public getPeriodBalanceRawText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodBalanceRaw());
    }


    public getPeriodCreditText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodCredit());
    }

    public getPeriodDebitText(): string {
        return this.balancesReport.getBook().formatValue(this.getPeriodDebit());
    }

    public createDataTable(): BalancesDataTableBuilder {
        return new BalancesDataTableBuilder(this.balancesReport.getBook(), [this], this.balancesReport.getPeriodicity());
    }

    public getBalancesContainers(): BalancesContainer[] {
        return [];
    }

    public getBalances(): Balance[] {
        if (!this.payload.balances) {
            return new Array<Balance>();
        }
        return this.payload.balances.map(balancePlain => new Balance(this, balancePlain));
    }

    public getProperties(): { [key: string]: string } {
        return this.payload.properties != null ? { ...this.payload.properties } : {};
    }


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


    public getPropertyKeys(): string[] {
        let properties = this.getProperties();
        let propertyKeys: string[] = []
        if (properties) {
            for (var key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    propertyKeys.push(key)
                }
            }
        }
        propertyKeys = propertyKeys.sort();
        return propertyKeys;
    }

    public getBalancesContainer(name: string): BalancesContainer {
        const normalizedName = normalizeName(name);
        if (this.getNormalizedName() == normalizedName) {
            return this;
        }
        throw `${name} does not match ${this.getName()}`;
    }

}
