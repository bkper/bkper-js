import * as AccountService from "../service/account-service.js";
import * as GroupService from "../service/group-service.js";
import { Book } from "./Book.js";
import { Config } from "./Config.js";
import { AccountType } from "./Enums.js";
import { Group } from "./Group.js";
import { normalizeText } from "../utils.js";
import { Resource } from "./Resource.js";

/**
 * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
 *
 * It maintains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transactions]].
 *
 * An Account can be grouped by [[Groups]].
 *
 * @public
 */
export class Account extends Resource<bkper.Account> {
  /** @internal */
  private book: Book;

  constructor(book: Book, payload?: bkper.Account) {
    super(payload || { createdAt: `${Date.now()}` });
    this.book = book;
  }

  /** @internal */
  public getConfig(): Config {
    return this.book.getConfig();
  }

  /**
   * Gets the Account internal id.
   *
   * @returns The Account internal id
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * Gets the Account name.
   *
   * @returns The Account name
   */
  public getName(): string | undefined {
    return this.payload.name;
  }

  /**
   * Sets the name of the Account.
   *
   * @param name - The name to set
   *
   * @returns This Account, for chaining
   */
  public setName(name: string): Account {
    this.payload.name = name;
    return this;
  }

  /**
   * Tells if the balance of this Account has been verified/audited.
   *
   * @returns True if the balance of this Account has been verified/audited
   */
  public isBalanceVerified(): boolean | undefined {
    return this.payload.balanceVerified;
  }

  /**
   * Gets the normalized name of this Account without spaces or special characters.
   *
   * @returns The name of this Account without spaces or special characters
   */
  public getNormalizedName(): string {
    if (this.payload.normalizedName) {
      return this.payload.normalizedName;
    } else {
      return normalizeText(this.getName());
    }
  }

  /**
   * Gets the type of this Account.
   *
   * @returns The [[AccountType]] of this Account
   */
  public getType(): AccountType {
    return this.payload.type as AccountType;
  }

  /**
   * Sets the type of the Account.
   *
   * @param type - The [[AccountType]] to set
   *
   * @returns This Account, for chaining
   */
  public setType(type: AccountType): Account {
    this.payload.type = type;
    return this;
  }

  /**
   * Gets the custom properties stored in this Account.
   *
   * @returns The custom properties object
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null ? { ...this.payload.properties } : {};
  }

  /**
   * Sets the custom properties of the Account.
   *
   * @param properties - Object with key/value pair properties
   *
   * @returns This Account, for chaining
   */
  public setProperties(properties: { [key: string]: string }): Account {
    this.payload.properties = { ...properties };
    return this;
  }

  /**
   * Gets the property value for given keys. First property found will be retrieved.
   *
   * @param keys - The property key
   *
   * @returns The property value or undefined if not found
   */
  public getProperty(...keys: string[]): string | undefined {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value = this.payload.properties != null ? this.payload.properties[key] : null;
      if (value != null && value.trim() != "") {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Sets a custom property in the Account.
   *
   * @param key - The property key
   * @param value - The property value
   *
   * @returns This Account, for chaining
   */
  public setProperty(key: string, value: string | null): Account {
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
   * @returns This Account, for chaining
   */
  public deleteProperty(key: string): Account {
    this.setProperty(key, null);
    return this;
  }

  /**
   * Tells if this Account is archived.
   *
   * @returns True if the Account is archived
   */
  public isArchived(): boolean | undefined {
    return this.payload.archived;
  }

  /**
   * Sets Account archived/unarchived.
   *
   * @param archived - True to archive, false to unarchive
   *
   * @returns This Account, for chaining
   */
  public setArchived(archived: boolean): Account {
    this.payload.archived = archived;
    return this;
  }

  /**
   * Tells if the Account has any transaction already posted.
   *
   * Accounts with transaction posted, even with zero balance, can only be archived.
   *
   * @returns True if the Account has transactions posted
   */
  public hasTransactionPosted(): boolean | undefined {
    return this.payload.hasTransactionPosted;
  }

  /**
   * Tells if the Account is permanent.
   *
   * Permanent Accounts are the ones which final balance is relevant and keep its balances over time.
   *
   * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(Accountancy)#Based_on_periodicity_of_flow)
   *
   * Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank Accounts, money, debts and so on.
   *
   * @returns True if its a permanent Account
   */
  public isPermanent(): boolean | undefined {
    return this.payload.permanent;
  }

  /**
   * Tells if the Account has a Credit nature or Debit otherwise.
   *
   * Credit Accounts are just for representation purposes. It increase or decrease the absolute balance. It doesn't affect the overall balance or the behavior of the system.
   *
   * The absolute balance of credit Accounts increase when it participate as a credit/origin in a transaction. Its usually for Accounts that increase the balance of the assets, like revenue Accounts.
   *
   * ```
   *         Crediting a credit
   *   Thus ---------------------> Account increases its absolute balance
   *         Debiting a debit
   *
   *
   *         Debiting a credit
   *   Thus ---------------------> Account decreases its absolute balance
   *         Crediting a debit
   * ```
   *
   * As a rule of thumb, and for simple understanding, almost all Accounts are Debit nature (NOT credit), except the ones that "offers" amount for the books, like revenue Accounts.
   *
   * @returns True if the Account has credit nature
   */
  public isCredit(): boolean | undefined {
    return this.payload.credit;
  }

  /**
   * Gets the [[Groups]] of this Account.
   *
   * @returns Promise with the [[Groups]] of this Account
   */
  public async getGroups(): Promise<Group[]> {
    const id = this.getId();
    if (!id) {
      return [];
    }
    let groups = await GroupService.getGroupsByAccountId(
      this.book.getId(),
      id,
      this.getConfig()
    );
    let groupsObj = groups.map((group) => new Group(this.book, group));
    return groupsObj;
  }

  /**
   * Sets the groups of the Account.
   *
   * @param groups - The groups to set
   *
   * @returns This Account, for chaining
   */
  public setGroups(groups: Group[] | bkper.Group[]): Account {
    this.payload.groups = undefined;
    if (groups != null) {
      groups.forEach((group) => this.addGroup(group));
    }
    return this;
  }

  /**
   * Adds a group to the Account.
   *
   * @param group - The group to add
   *
   * @returns This Account, for chaining
   */
  public addGroup(group: Group | bkper.Group): Account {
    if (!this.payload.groups) {
      this.payload.groups = [];
    }

    if (group instanceof Group) {
      this.payload.groups.push(group.json());
    } else {
      this.payload.groups.push(group);
    }

    return this;
  }

  /**
   * Removes a group from the Account.
   *
   * @param group - The group name, id or object to remove
   *
   * @returns Promise with this Account, for chaining
   */
  public async removeGroup(group: string | Group): Promise<Account> {
    if (this.payload.groups != null) {
      let groupObject: Group | undefined = undefined;
      if (group instanceof Group) {
        groupObject = group;
      } else if (typeof group == "string") {
        groupObject = await this.book.getGroup(group);
      }
      if (groupObject) {
        for (let i = 0; i < this.payload.groups.length; i++) {
          const groupId = this.payload.groups[i].id;
          if (groupId == groupObject.getId()) {
            this.payload.groups.splice(i, 1);
          }
        }
      }
    }

    return this;
  }

  /**
   * Tells if this Account is in the [[Group]].
   *
   * @param group - The Group name, id or object
   *
   * @returns Promise with true if the Account is in the group
   */
  public async isInGroup(group: string | Group): Promise<boolean> {
    if (group == null) {
      return false;
    }

    //Group object
    if (group instanceof Group) {
      return this.isInGroupObject_(group);
    }

    //id or name
    var foundGroup = await this.book.getGroup(group);
    if (foundGroup == null) {
      return false;
    }
    return this.isInGroupObject_(foundGroup);
  }

  /** @internal */
  private isInGroupObject_(group: Group): boolean {
    if (this.payload.groups == null) {
      return false;
    }

    for (var i = 0; i < this.payload.groups.length; i++) {
      if (this.payload.groups[i] == group.getId()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Performs create new Account.
   *
   * @returns Promise with this Account after creation
   */
  public async create(): Promise<Account> {
    this.payload = await AccountService.createAccount(
      this.book.getId(),
      this.payload,
      this.getConfig()
    );
    this.updateAccountCache();
    return this;
  }

  /**
   * Performs update Account, applying pending changes.
   *
   * @returns Promise with this Account after update
   */
  public async update(): Promise<Account> {
    this.payload = await AccountService.updateAccount(
      this.book.getId(),
      this.payload,
      this.getConfig()
    );
    this.updateAccountCache();
    return this;
  }

  /**
   * Performs delete Account.
   *
   * @returns Promise with this Account after deletion
   */
  public async remove(): Promise<Account> {
    this.payload = await AccountService.deleteAccount(
      this.book.getId(),
      this.payload,
      this.getConfig()
    );
    this.updateAccountCache(true);
    return this;
  }

  /** @internal */
  private updateAccountCache(remove?: boolean): void {
    this.book.setAccount(this.payload, remove);
    this.book.clearCache();
  }
}
