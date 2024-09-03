import * as GroupService from '../service/group-service.js';
import { normalizeText } from "../utils.js";
import { Account } from './Account.js';
import { Book } from "./Book.js";
import { AccountType } from './Enums.js';
import * as Utils from '../utils.js';

/**
 * This class defines a Group of [[Accounts]].
 * 
 * Accounts can be grouped by different meaning, like Expenses, Revenue, Assets, Liabilities and so on
 * 
 * Its useful to keep organized and for high level analysis.
 * 
 * @public
 */
export class Group {
  
  /** @internal */
  private book: Book

  /** @internal */
  private wrapped: bkper.Group
  
  /** @internal */
  private accounts?: Set<Account>

  constructor(book: Book, json?: bkper.Group) {
    this.book = book;
    this.wrapped = json || {}
  }

  /**
   * 
   * @returns The wrapped plain json object
   */
  public json(): bkper.Group {
    return this.wrapped;
  }
  
  /**
   * @returns The id of this Group
   */
  public getId(): string | undefined {
    return this.wrapped.id;
  }

  /**
   * @returns The parent Group
   */
  public async getParent(): Promise<Group | undefined> {
    if (this.wrapped.parent) {
      return await this.book.getGroup(this.wrapped.parent.id)
    } else {
      return undefined;
    }
  }

  /**
   * Sets the parent Group.
   * 
   * @returns This Group, for chainning.
   */  
  public setParent(group: Group | null | undefined): Group {
    if (group) {
      this.wrapped.parent = {id: group.getId(), name: group.getName(), normalizedName: group.getNormalizedName()};
    } else {
      this.wrapped.parent = undefined;
    }
    return this;
  }

  /**
   * @returns The name of this Group
   */
  public getName(): string | undefined {
    return this.wrapped.name;
  }

  /**
   * Sets the name of the Group.
   * 
   * @returns This Group, for chainning.
   */
  public setName(name: string): Group {
    this.wrapped.name = name;
    return this;
  }

  /**
   * @returns The name of this group without spaces and special characters
   */
  public getNormalizedName(): string {
    if (this.wrapped.normalizedName) {
      return this.wrapped.normalizedName;
    } else {
      return normalizeText(this.getName())
    }
  }

  /**
   * @returns All Accounts of this group.
   */
  public async getAccounts(): Promise<Account[]> {
    let accountsPlain = await GroupService.getAccounts(this.book.getId(), this.getId());
    if (!accountsPlain) {
      return [];
    }
    let accounts = accountsPlain.map(acc => new Account(this.book, acc))
    return accounts;
  }


  /**
   * @returns True if this group has any account in it
   */
  public hasAccounts(): boolean | undefined {
    return this.wrapped.hasAccounts;
  }

  /**
   * @returns The type for of the accounts of this group. Null if mixed
   */
  public getType(): AccountType {
    return this.wrapped.type as AccountType;
  }

  /**
   * Gets the custom properties stored in this Group
   */
  public getProperties(): { [key: string]: string } {
    return this.wrapped.properties != null ? { ...this.wrapped.properties } : {};
  }

  /**
   * Sets the custom properties of the Group
   * 
   * @param properties - Object with key/value pair properties
   * 
   * @returns This Group, for chainning. 
   */
  public setProperties(properties: { [key: string]: string }): Group {
    this.wrapped.properties = { ...properties };
    return this;
  }

  /**
   * Gets the property value for given keys. First property found will be retrieved
   * 
   * @param keys - The property key
   */
  public getProperty(...keys: string[]): string | undefined {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value = this.wrapped.properties != null ? this.wrapped.properties[key] : null
      if (value != null && value.trim() != '') {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Sets a custom property in the Group.
   * 
   * @param key - The property key
   * @param value - The property value
   */
  public setProperty(key: string, value: string | null): Group {
    if (key == null || key.trim() == '') {
      return this;
    }
    if (this.wrapped.properties == null) {
      this.wrapped.properties = {};
    }
    if (!value) {
      value = ''
    }
    this.wrapped.properties[key] = value;
    return this;
  }

  /**
   * Delete a custom property
   * 
   * @param key - The property key
   * 
   * @returns This Group, for chainning. 
   */
  public deleteProperty(key: string): Group {
    this.setProperty(key, null);
    return this;
  }

  /**
   * Tell if the Group is hidden on main transactions menu
   */
  public isHidden(): boolean | undefined{
    return this.wrapped.hidden;
  }

  /**
   *  Hide/Show group on main menu.
   */
  public setHidden(hidden: boolean): Group {
    this.wrapped.hidden = hidden;
    return this;
  }

  /**
   * Perform create new group.
   */
  public async create(): Promise<Group> {
    this.wrapped = await GroupService.createGroup(this.book.getId(), this.wrapped);
    this.book.updateGroupCache(this);
    return this;
  }

  /**
   * Perform update group, applying pending changes.
   */
  public async update(): Promise<Group> {
    this.wrapped = await GroupService.updateGroup(this.book.getId(), this.wrapped);
    this.book.updateGroupCache(this);
    return this;

  }

  /**
   * Perform delete group.
   */
  public async remove(): Promise<Group> {
    this.wrapped = await GroupService.deleteGroup(this.book.getId(), this.wrapped);
    this.book.removeGroupCache(this);
    return this;
  }

}
