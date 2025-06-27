/**
 * Defines an Agent on Bkper.
 * 
 * An Agent represents an entity (such as an App or Bot) that interacts with Bkper, executing actions on behalf of users.
 * 
 * @public
 */
export class Agent {

    public payload: bkper.Agent;

    constructor(payload?: bkper.Agent) {
        this.payload = payload || {};
    }

    /**
     * Gets the wrapped plain JSON object.
     *
     * @returns The wrapped plain json object
     */
    public json(): bkper.Agent {
        return { ...this.payload };
    }

    /**
     * Gets the Agent universal identifier.
     *
     * @returns The Agent universal identifier
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the Agent name.
     *
     * @returns The Agent name
     */
    public getName(): string | undefined {
        return this.payload.name;
    }

    /**
     * Gets the Agent logo URL.
     *
     * @returns The Agent logo url
     */
    public getLogoUrl(): string | undefined {
        return this.payload.logo;
    }

    /**
     * Gets the Agent logo URL in dark mode.
     *
     * @returns The Agent logo url in dark mode
     */
    public getLogoUrlDark(): string | undefined {
        return this.payload.logoDark;
    }

}
