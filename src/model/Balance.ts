import { BalancesContainer } from "./BalancesContainer.js";
import * as Utils from '../utils.js';
import { Amount } from "./Amount.js";

/**
 * Class that represents an [[Account]] or [[Group]] balance on a window of time (Day / Month / Year). 
 * 
 * @public
 */
export class Balance {

    payload: bkper.Balance;
    private container: BalancesContainer;

    constructor(container: BalancesContainer, balancePlain: bkper.Balance) {
        this.container = container;
        this.payload = balancePlain;
    }

    /**
     * The day of the balance. Days starts on 1 to 31. 
     * 
     * Day can be 0 (zero) in case of Monthly or Early [[Periodicity]] of the [[BalancesReport]]
     */
    public getDay(): number {
        return this.payload.day!;
    }

    /**
     * The month of the balance. Months starts on 1 (January) to 12 (December)
     * 
     * Month can be 0 (zero) in case of Early [[Periodicity]] of the [[BalancesReport]]
     */
    public getMonth(): number {
        return this.payload.month!;
    }

    /**
     * The year of the balance
     */
    public getYear(): number {
        return this.payload.year!;
    }

    /**
     * Date object constructed based on [[Book]] time zone offset. Usefull for 
     * 
     * If Month or Day is zero, the date will be constructed with first Month (January) or Day (1) of the next period.
     */
    public getDate(): Date {
        var year = this.getYear();
        var month = this.getMonth();
        var day = this.getDay();

        if (month == null || month == 0) {
            year++;
        }
        if (day == null || day == 0) {
            month++;
        }
        var date = Utils.createDate(year, month, day, this.container.getBalancesReport().getBook().getTimeZoneOffset());
        return date;
    }

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
    public getFuzzyDate(): number {
        return this.payload.fuzzyDate!;
    }

    /**
     * The cumulative balance to the date, based on the credit nature of the container
     */
    public getCumulativeBalance(): Amount {
        return Utils.getRepresentativeValue(this.getCumulativeBalanceRaw(), this.container.isCredit());
    }

    /**
     * The raw cumulative balance to the date.
     */
    public getCumulativeBalanceRaw(): Amount {
        return new Amount(this.payload.cumulativeBalance!);
    }

    /**
     * The cumulative credit to the date.
     */
    public getCumulativeCredit(): Amount {
        return new Amount(this.payload.cumulativeCredit!);
    }

    /**
     * The cumulative debit to the date.
     */
    public getCumulativeDebit(): Amount {
        return new Amount(this.payload.cumulativeDebit!);
    }

    /**
     * The balance on the date period, based on credit nature of the container.
     */
    public getPeriodBalance(): Amount {
        return Utils.getRepresentativeValue(this.getPeriodBalanceRaw(), this.container.isCredit());
    }

    /**
     * The raw balance on the date period.
     */
    public getPeriodBalanceRaw(): Amount {
        return new Amount(this.payload.periodBalance!);
    }

    /**
     * The credit on the date period.
     */
    public getPeriodCredit(): Amount {
        return new Amount(this.payload.periodCredit!);
    }

    /**
     * The debit on the date period.
     */
    public getPeriodDebit(): Amount {
        return new Amount(this.payload.periodDebit!);
    }

}
