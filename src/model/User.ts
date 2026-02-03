import { Connection } from "./Connection.js";
import { Config } from "./Config.js";
import { Resource } from "./Resource.js";
import { Bkper } from "./Bkper.js";
import * as ConnectionService from "../service/connection-service.js";
import * as UserService from "../service/user-service.js";
import { Billing } from "./Billing.js";

/**
 * This class defines a User on the Bkper platform.
 *
 * Users can own and collaborate on [[Books]], manage [[Collections]], and connect to external services through [[Connections]].
 *
 * Each User has a unique identity, subscription plan details, and access permissions across the platform.
 *
 * @public
 */
export class User extends Resource<bkper.User> {

    private config?: Config;

    constructor(payload?: bkper.User, config?: Config) {
        super(payload);
        this.config = config;
    }

    /** @internal */
    public getConfig(): Config {
        return this.config || Bkper.globalConfig;
    }

    /**
     * Gets the id of the User.
     *
     * @returns The User's id
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the given name of the User.
     *
     * @returns The User's given name
     */
    public getGivenName(): string | undefined {
        return this.payload.givenName;
    }

    /**
     * Gets the name of the User.
     *
     * @returns The User's name
     */
    public getName(): string | undefined {
        return this.payload.name;
    }

    /**
     * Gets the avatar url of the User.
     *
     * @returns The User's avatar url
     */
    public getAvatarUrl(): string | undefined {
        return this.payload.avatarUrl;
    }

    /**
     * Gets the full name of the User.
     *
     * @returns The User's full name
     */
    public getFullName(): string | undefined {
        return this.payload.fullName;
    }

    /**
     * Gets the email of the User.
     *
     * @returns The User's email
     */
    public getEmail(): string | undefined {
        return this.payload.email;
    }

    /**
     * Gets the hosted domain of the User.
     *
     * @returns The User's hosted domain
     */
    public getHostedDomain(): string | undefined {
        return this.payload.hostedDomain;
    }

    /**
     * Gets the username of the User.
     *
     * @returns The User's username
     */
    public getUsername(): string | undefined {
        return this.payload.username;
    }
    
    /**
     * Gets the billing information for this User.
     *
     * @returns The User's billing information
     */
    public async getBilling(): Promise<Billing> {
        const payload = await UserService.getBilling(this.getConfig());
        return new Billing(payload, this.config);
    }

    /**
     * Tells if the User has already used [[Connections]].
     *
     * @returns True if the User has already used Connections
     */
    public hasUsedConnections(): boolean | undefined {
        return this.payload.bankConnections;
    }

    /**
     * Gets the [[Connections]] of the User.
     *
     * @returns The retrieved Connection objects
     */
    public async getConnections(): Promise<Connection[]> {
        const json = await ConnectionService.listConnections(this.getConfig());
        return json.map((c) => new Connection(c, this.config));
    }

    /**
     * Gets a [[Connection]] of the User.
     *
     * @param id - The Connection's id
     *
     * @returns The retrieved Connection object
     */
    public async getConnection(id: string): Promise<Connection> {
        const json = await ConnectionService.getConnection(id, this.getConfig());
        return new Connection(json, this.config);
    }

}
