import { Connection } from "./Connection.js";
import * as ConnectionService from '../service/connection-service.js';

/**
 * This class defines a User.
 * 
 * @public
 */
export class User {

  /** @internal */
  private wrapped: bkper.User = {};

  constructor(json?: bkper.User) {
    this.wrapped = json || {};
  }

  /**
   * @returns The wrapped plain json object
   */
  public json(): bkper.User {
    return this.wrapped;
  }

  /**
   * Gets the id of the User.
   * 
   * @returns The User's id
   */
  public getId(): string | undefined {
    return this.wrapped.id;
  }

  /**
   * Gets the name of the User.
   * 
   * @returns The User's name
   */
  public getName(): string | undefined {
    return this.wrapped.name;
  }

  /**
   * Gets the full name of the User.
   * 
   * @returns The User's full name
   */
  public getFullName(): string | undefined {
    return this.wrapped.fullName;
  }

  /**
   * Gets the email of the User.
   * 
   * @returns The User's email
   */
  public getEmail(): string | undefined {
    return this.wrapped.email;
  }

  /**
   * Gets the hosted domain of the User.
   * 
   * @returns The User's hosted domain
   */
  public getHostedDomain(): string | undefined {
    return this.wrapped.hostedDomain;
  }

  /**
   * Tells if the User is in the free plan.
   * 
   * @returns True if the User is in the free plan
   */
  public isFree(): boolean | undefined {
    return this.wrapped.free;
  }

  /**
   * Tells if the User has started the trial.
   * 
   * @returns True if the User has started the trial
   */
  public hasStartedTrial(): boolean | undefined {
    return this.wrapped.startedTrial;
  }

  /**
   * Gets the days left in User's trial.
   * 
   * @returns The User's days left in trial
   */
  public getDaysLeftInTrial(): number | undefined {
    return this.wrapped.daysLeftInTrial;
  }

  /**
   * Tells if the User has already used [[Connections]].
   * 
   * @returns True if the User has already used Connections
   */
  public hasUsedConnections(): boolean | undefined {
    return this.wrapped.bankConnections;
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
