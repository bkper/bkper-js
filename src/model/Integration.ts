import * as IntegrationService from "../service/integration-service.js";
import { ResourceProperty } from "./ResourceProperty.js";
import { Config } from "./Config.js";
import { Bkper } from "./Bkper.js";

/**
 * This class defines a Integration from an [[User]] to an external service.
 *
 * @public
 */
export class Integration extends ResourceProperty<bkper.Integration> {

    private config?: Config;

    constructor(payload?: bkper.Integration, config?: Config) {
        super(payload || {});
        this.config = config;
    }

    /** @internal */
    public getConfig(): Config {
        return this.config || Bkper.globalConfig;
    }

    /**
     * Gets the [[Book]] id of the Integration.
     *
     * @returns The Integration's Book id
     */
    public getBookId(): string | undefined {
        return this.payload.bookId;
    }

    /**
     * Gets the id of the Integration.
     *
     * @returns This Integration's id
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the name of the Integration.
     *
     * @returns The Integration's name
     */
    public getName(): string | undefined {
        return this.payload.name;
    }

    /**
     * Gets the name of the user who added the Integration.
     *
     * @returns The user name of who added the Integration
     */
    public getAddedBy(): string | undefined {
        return this.payload.addedBy;
    }

    /**
     * Gets the agent id of the Integration.
     *
     * @returns The Integration's agent id
     */
    public getAgentId(): string | undefined {
        return this.payload.agentId;
    }

    /**
     * Gets the logo of the Integration.
     *
     * @returns The Integration's logo
     * 
     * @deprecated Use getLogoUrl instead.
     */
    public getLogo(): string | undefined {
        return this.payload.logo;
    }

    /**
     * Gets the logo url of this Integration.
     *
     * @returns The logo url of this Integration
     */
    public getLogoUrl(): string | undefined {
        return this.payload.logo;
    }

    /**
     * Gets the logo url of this Integration in dark mode.
     *
     * @returns The logo url of this Integration in dark mode
     */
    public getLogoUrlDark(): string | undefined {
        return this.payload.logoDark;
    }

    /**
     * Gets the date when the Integration was added.
     *
     * @returns The Integration add date in milliseconds
     */
    public getDateAddedMs(): string | undefined {
        return this.payload.dateAddedMs;
    }

    /**
     * Gets the date when the Integration was last updated.
     *
     * @returns The Integration last update date in milliseconds
     */
    public getLastUpdateMs(): string | undefined {
        return this.payload.lastUpdateMs;
    }



    /**
     * Performs remove Integration.
     *
     * @returns The removed Integration object
     */
    public async remove(): Promise<Integration> {
        const bookId = this.getBookId();
        const integrationId = this.getId();
        if (bookId && integrationId) {
            this.payload = await IntegrationService.deleteIntegration(
                bookId,
                integrationId,
                this.getConfig()
            );
        }
        return this;
    }
}
