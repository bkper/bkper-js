
/**
 * This class defines a Integration from an [[User]] to an external service.
 * 
 * @public
 */
export class Integration {

  public payload: bkper.Integration

  constructor(payload?: bkper.Integration) {
    this.payload = payload || {};
  }

  /**
   * @returns An immutable copy of the json payload
   */
  public json(): bkper.Integration {
    return { ...this.payload };
  }

  /**
   * Gets the [[Book]] id of the Integration.
   * 
   * @returns The Integration's Book id
   */
  public getBookId(): string | undefined {
    return this.payload.bookId
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
   * Gets the custom properties stored in the Integration.
   * 
   * @returns Object with key/value pair properties
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null ? { ...this.payload.properties } : {};
  }

  /**
   * Sets the custom properties of the Integration.
   * 
   * @param properties - Object with key/value pair properties
   * 
   * @returns The Integration, for chainning
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
      let value = this.payload.properties != null ? this.payload.properties[key] : null
      if (value != null && value.trim() != '') {
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
    if (key == null || key.trim() == '') {
      return this;
    }
    if (this.payload.properties == null) {
      this.payload.properties = {};
    }
    if (!value) {
      value = ''
    }
    this.payload.properties[key] = value;
    return this;
  }

  /**
   * Deletes a custom property stored in the Integration.
   * 
   * @param key - The property key
   * 
   * @returns The Integration, for chainning
   */
  public deleteProperty(key: string): Integration {
    this.setProperty(key, null);
    return this;
  }

}
