import * as IntegrationService from "../service/integration-service.js";
import { Resource } from "./Resource.js";
import { Config } from "./Config.js";
import { Bkper } from "./Bkper.js";

/**
 * This class defines a Integration from an [[User]] to an external service.
 *
 * @public
 */
export class Integration extends Resource<bkper.Integration> {

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
   * Gets the custom properties stored in the Integration.
   *
   * @returns Object with key/value pair properties
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null
      ? { ...this.payload.properties }
      : {};
  }

  /**
   * Sets the custom properties of the Integration.
   *
   * @param properties - Object with key/value pair properties
   *
   * @returns The Integration, for chaining
   */
  public setProperties(properties: { [key: string]: string }): Integration {
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
   * Sets a custom property in the Integration.
   *
   * @param key - The property key
   * @param value - The property value
   *
   * @returns The Integration, for chaining
   */
  public setProperty(key: string, value: string | null): Integration {
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
   * Deletes a custom property stored in the Integration.
   *
   * @param key - The property key
   *
   * @returns The Integration, for chaining
   */
  public deleteProperty(key: string): Integration {
    this.setProperty(key, null);
    return this;
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
