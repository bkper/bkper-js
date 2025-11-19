import { Resource } from "./Resource.js";

/**
 * Abstract base class for Bkper resources that support custom properties.
 * 
 * Extends Resource<T> and adds property management methods for entities
 * that have a properties field in their payload.
 *
 * @public
 */
export abstract class ResourceProperty<T extends { properties?: { [key: string]: string } }> extends Resource<T> {
    
    /**
     * Gets the custom properties stored in this resource.
     *
     * @returns Object with key/value pair properties
     */
    public getProperties(): { [key: string]: string } {
        return this.payload.properties != null 
            ? { ...this.payload.properties } 
            : {};
    }

    /**
     * Sets the custom properties of this resource.
     *
     * @param properties - Object with key/value pair properties
     *
     * @returns This resource, for chaining
     */
    public setProperties(properties: { [key: string]: string }): this {
        this.payload.properties = { ...properties };
        return this;
    }

    /**
     * Gets the property value for given keys. First property found will be retrieved.
     *
     * @param keys - The property keys to search for
     *
     * @returns The property value or undefined if not found
     */
    public getProperty(...keys: string[]): string | undefined {
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            let value = this.payload.properties != null 
                ? this.payload.properties[key] 
                : null;
            if (value != null && value.trim() != "") {
                return value;
            }
        }
        return undefined;
    }

    /**
     * Sets a custom property in this resource.
     *
     * @param key - The property key
     * @param value - The property value, or null/undefined to clean it
     *
     * @returns This resource, for chaining
     */
    public setProperty(key: string, value: string | null | undefined): this {
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
     * Deletes a custom property.
     *
     * @param key - The property key
     *
     * @returns This resource, for chaining
     */
    public deleteProperty(key: string): this {
        this.setProperty(key, null);
        return this;
    }

    /**
     * Gets the custom properties keys stored in this resource.
     *
     * @returns Array of property keys sorted alphabetically
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
}
