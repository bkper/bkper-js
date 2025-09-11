import { Config } from "./Config.js";
import { Resource } from "./Resource.js";
import { Bkper } from "./Bkper.js";
import * as ConnectionService from "../service/connection-service.js";
import { Integration } from "./Integration.js";

/**
 * This class defines a Connection from an [[User]] to an external service.
 *
 * @public
 */
export class Connection extends Resource<bkper.Connection> {
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
   * Gets the custom properties stored in the Connection
   *
   * @returns Object with key/value pair properties
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null
      ? { ...this.payload.properties }
      : {};
  }

  /**
   * Sets the custom properties of the Connection.
   *
   * @param properties - Object with key/value pair properties
   *
   * @returns The Connection, for chaining
   */
  public setProperties(properties: { [key: string]: string }): Connection {
    this.payload.properties = { ...properties };
    return this;
  }

  /**
   * Gets the property value for given keys. First property found will be retrieved.
   *
   * @param keys - The property key
   *
   * @returns The retrieved property value
   */
  public getProperty(...keys: string[]): string | undefined {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value =
        this.payload.properties != null ? this.payload.properties[key] : null;
      if (value != null && value.trim() != "") {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Sets a custom property in the Connection.
   *
   * @param key - The property key
   * @param value - The property value
   *
   * @returns The Connection, for chaining
   */
  public setProperty(key: string, value: string | null): Connection {
    if (key == null || key.trim() == "") {
      return this;
    }
    if (this.payload.properties == null) {
      this.payload.properties = {};
    }
    if (!value) {
      value = "";
    }
    this.payload.properties[key] = value;
    return this;
  }

  /**
   * Deletes a custom property stored in the Connection.
   *
   * @param key - The property key
   *
   * @returns The Connection, for chaining
   */
  public deleteProperty(key: string): Connection {
    this.setProperty(key, null);
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
   * Gets the custom properties keys stored in the Connection.
   *
   * @returns The retrieved property keys
   */
  public getPropertyKeys(): string[] {
    let properties = this.getProperties();
    let propertyKeys: string[] = [];
    if (properties) {
      for (var key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
          propertyKeys.push(key);
        }
      }
    }
    propertyKeys = propertyKeys.sort();
    return propertyKeys;
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
    const integrations = integrationsPlain.map((i) => new Integration(i));
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
