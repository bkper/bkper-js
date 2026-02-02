import { Config } from "./Config.js";
import { Resource } from "./Resource.js";
import { Bkper } from "./Bkper.js";
import * as UserService from "../service/user-service.js";

/**
 * This class defines the Billing information for a [[User]].
 *
 * The Billing information includes the plan, the admin email, and the billing portal URL.
 *
 * @public
 */
export class Billing extends Resource<bkper.Billing> {

    private config?: Config;

    constructor(json?: bkper.Billing, config?: Config) {
        super(json);
        this.config = config;
    }

    /** @internal */
    public getConfig(): Config {
        return this.config || Bkper.globalConfig;
    }

    /**
     * Tells if billing is enabled for the User.
     *
     * @returns True if billing is enabled for the User
     */
    public isEnabled(): boolean | undefined {
        return this.payload.enabled;
    }

    /**
     * Gets the email for the User.
     *
     * @returns The User's email
     */
    public getEmail(): string | undefined {
        return this.payload.email;
    }

    /**
     * Gets the hosted domain for the User.
     *
     * @returns The User's hosted domain
     */
    public getHostedDomain(): string | undefined {
        return this.payload.hostedDomain;
    }

    /**
     * Gets the current plan of the User.
     *
     * @returns The User's plan
     */
    public getPlan(): string | undefined {
        return this.payload.plan;
    }

    /**
     * Tells if the User's current plan payment is overdue.
     *
     * @returns True if the plan payment is overdue
     */
    public isPlanOverdue(): boolean | undefined {
        return this.payload.planOverdue;
    }

    /**
     * Gets the admin email for this User's billing account.
     *
     * @returns The billing admin email
     */
    public getAdminEmail(): string | undefined {
        return this.payload.adminEmail;
    }

    /**
     * Tells if the User has started the trial period.
     *
     * @returns True if the User has started the trial period
     */
    public hasStartedTrial(): boolean | undefined {
        return this.payload.startedTrial;
    }

    /**
     * Gets the number of days left in User's trial period.
     *
     * @returns The number of days left in trial period
     */
    public getDaysLeftInTrial(): number | undefined {
        return this.payload.daysLeftInTrial;
    }

    /**
     * Gets the number of total transactions this month for the User's billing account.
     *
     * @returns The number of total transactions this month
     */
    public getTotalTransactionsThisMonth(): number | undefined {
        return this.payload.totalTransactionsThisMonth;
    }

    /**
     * Gets the number of total transactions this year for the User's billing account.
     *
     * @returns The number of total transactions this year
     */
    public getTotalTransactionsThisYear(): number | undefined {
        return this.payload.totalTransactionsThisYear;
    }

    /**
     * Gets the transaction counts associated to the User's billing account.
     *
     * @returns The transaction counts associated to the User's billing account
     */
    public async getCounts(): Promise<bkper.Counts> {
        const countsPayload = await UserService.getBillingCounts(this.getConfig());
        return countsPayload;
    }

    /**
     * Gets the URL to redirect the User to the billing portal.
     *
     * @param returnUrl - The URL to return to after the User has been redirected to the billing portal
     *
     * @returns The URL to redirect the User to the billing portal
     */
    public async getPortalUrl(returnUrl: string): Promise<string | undefined> {
        const urlPayload = await UserService.getBillingPortalUrl(returnUrl, this.getConfig());
        return urlPayload?.url;
    }

    /**
     * Gets the URL to redirect the User to the billing checkout.
     *
     * @param plan - The plan to checkout
     * @param successUrl - The URL to redirect to after the User has successfully checked out
     * @param cancelUrl - The URL to redirect to in case the checkout is cancelled
     *
     * @returns The URL to redirect the User to the billing checkout
     */
    public async getCheckoutUrl(plan: string, successUrl?: string, cancelUrl?: string): Promise<string | undefined> {
        const urlPayload = await UserService.getBillingCheckoutUrl(plan, successUrl, cancelUrl, this.getConfig());
        return urlPayload?.url;
    }

}
