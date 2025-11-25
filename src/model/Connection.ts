import { Config } from "./Config.js";
import { ResourceProperty } from "./ResourceProperty.js";
import { Bkper } from "./Bkper.js";
import * as ConnectionService from "../service/connection-service.js";
import { Integration } from "./Integration.js";

/**
 * This class defines a Connection from an [[User]] to an external service.
 *
 * @public
 */
export class Connection extends ResourceProperty<bkper.Connection> {
    private config?: Config;

    constructor(payload?: bkper.Connection, config?: Config) {
        super(payload);
        this.config = config;
    }

    /** @internal */
    public getConfig(): Config {
        return this.config || Bkper.globalConfig;
    }

    /**
     * Gets the id of the Connection.
     *
     * @returns The Connection's id
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the agentId of the Connection.
     *
     * @returns The Connection's agentId
     */
    public getAgentId(): string | undefined {
        return this.payload.agentId;
    }

    /**
     * Sets the Connection agentId.
     *
     * @param agentId - The Connection agentId
     *
     * @returns The Connection, for chaining
     */
    public setAgentId(agentId: string): Connection {
        this.payload.agentId = agentId;
        return this;
    }

    /**
     * Gets the name of the Connection.
     *
     * @returns The Connection name
     */
    public getName(): string | undefined {
        return this.payload.name;
    }

    /**
     * Gets the logo of the Connection.
     *
     * @returns The Connection logo
     */
    public getLogo(): string | undefined {
        return this.payload.logo;
    }

    /**
     * Gets the date when the Connection was added.
     *
     * @returns The Connection add date in milliseconds
     */
    public getDateAddedMs(): string | undefined {
        return this.payload.dateAddedMs;
    }

    /**
     * Gets the email of the owner of the Connection.
     *
     * @returns The Connection owner's email
     */
    public getEmail(): string | undefined {
        return this.payload.email;
    }

    /**
     * Sets the name of the Connection.
     *
     * @param name - The name of the Connection
     *
     * @returns The Connection, for chaining
     */
    public setName(name: string): Connection {
        this.payload.name = name;
        return this;
    }

    /**
     * Sets the universal unique identifier of the Connection.
     *
     * @param uuid - The universal unique identifier of the Connection
     *
     * @returns The Connection, for chaining
     */
    public setUUID(uuid: string): Connection {
        this.payload.uuid = uuid;
        return this;
    }

    /**
     * Gets the universal unique identifier of this Connection.
     *
     * @returns The Connection's universal unique identifier name
     */
    public getUUID(): string | undefined {
        return this.payload.uuid;
    }

    /**
     * Gets the type of the Connection.
     *
     * @returns The Connection type
     */
    public getType(): "APP" | "BANK" | undefined {
        return this.payload.type;
    }

    /**
     * Sets the Connection type.
     *
     * @param type - The Connection type
     *
     * @returns The Connection, for chaining
     */
    public setType(type: "APP" | "BANK"): Connection {
        this.payload.type = type;
        return this;
    }

    /**
     * Cleans any token property stored in the Connection.
     */
    public clearTokenProperties(): void {
        this.getPropertyKeys()
            .filter((key) => key.includes("token"))
            .forEach((key) => this.deleteProperty(key));
    }

    /**
     * Gets the existing [[Integrations]] on the Connection.
     *
     * @returns The existing Integration objects
     */
    public async getIntegrations(): Promise<Integration[]> {
        const id = this.getId();
        if (!id) {
            return [];
        }
        const integrationsPlain = await ConnectionService.listIntegrations(
            id,
            this.getConfig()
        );
        const integrations = integrationsPlain.map((i) => new Integration(i, this.config));
        return integrations;
    }

    /**
     * Performs create new Connection.
     *
     * @returns The created Connection, for chaining
     */
    public async create(): Promise<Connection> {
        this.payload = await ConnectionService.createConnection(
            this.payload,
            this.getConfig()
        );
        return this;
    }

    /**
     * Performs remove Connection.
     *
     * @returns The removed Connection object
     */
    public async remove(): Promise<Connection> {
        const connectionId = this.getId();
        if (connectionId) {
            this.payload = await ConnectionService.deleteConnection(
                connectionId,
                this.getConfig()
            );
        }
        return this;
    }
}
