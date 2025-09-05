import { Connection } from "./Connection.js";
import { Config } from "./Config.js";
import { Resource } from "./Resource.js";
import { Bkper } from "./Bkper.js";
import * as ConnectionService from "../service/connection-service.js";

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
   * Tells if the User is in the free plan.
   *
   * @returns True if the User is in the free plan
   */
  public isFree(): boolean | undefined {
    return this.payload.free;
  }

  /**
   * Gets the plan of the User.
   *
   * @returns The User's plan
   */
  public getPlan(): string | undefined {
    return this.payload.plan;
  }

  /**
   * Tells if billing is enabled for the User.
   *
   * @returns True if billing is enabled for the User
   */
  public hasBillingEnabled(): boolean | undefined {
    return this.payload.billingEnabled;
  }

  /**
   * Tells if the User has started the trial.
   *
   * @returns True if the User has started the trial
   */
  public hasStartedTrial(): boolean | undefined {
    return this.payload.startedTrial;
  }

  /**
   * Gets the days left in User's trial.
   *
   * @returns The User's days left in trial
   */
  public getDaysLeftInTrial(): number | undefined {
    return this.payload.daysLeftInTrial;
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
    return json.map((c) => new Connection(c));
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
    return new Connection(json);
  }
}
