import { Connection } from "./Connection.js";
import * as ConnectionService from '../service/connection-service.js';

/**
 * This class defines a User.
 * 
 * @public
 */
export class User {

  public payload: bkper.User = {};

  constructor(payload?: bkper.User) {
    this.payload = payload || {};
  }

  /**
   * @returns An immutable copy of the json payload
   */
  public json(): bkper.User {
    return { ...this.payload };
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
    const json = await ConnectionService.listConnections();
    return json.map(c => new Connection(c));
  }

  /**
   * Gets a [[Connection]] of the User.
   * 
   * @param id - The Connection's id
   * 
   * @returns The retrieved Connection object
   */
  public async getConnection(id: string): Promise<Connection> {
    const json = await ConnectionService.getConnection(id);
    return new Connection(json);
  }

}
