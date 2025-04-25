import * as AccountService from '../service/account-service.js'
import * as GroupService from '../service/group-service.js'
import { Book } from './Book.js';
import { AccountType } from './Enums.js';
import { Group } from './Group.js';
import { normalizeText, round } from '../utils.js';
import { Amount } from './Amount.js';

/**
 * 
 * This class defines an [Account](https://en.wikipedia.org/wiki/Account_(bookkeeping)) of a [[Book]].
 * 
 * It mantains a balance of all amount [credited and debited](http://en.wikipedia.org/wiki/Debits_and_credits) in it by [[Transactions]].
 * 
 * An Account can be grouped by [[Groups]].
 * 
 * @public
 */
export class Account {

  public payload: bkper.Account;

  /** @internal */
  private book: Book;

  constructor(book: Book, payload?: bkper.Account) {
    this.book = book;
    this.payload = payload || {
      createdAt: `${Date.now()}`
    };
  }

  /**
   * @returns An immutable copy of the json payload
   */
  public json(): bkper.Account {
    return { ...this.payload };
  }

  /**
   * Gets the account internal id.
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * Gets the account name.
   */
  public getName(): string | undefined {
    return this.payload.name;
  }

  /**
   * 
   * Sets the name of the Account.
   * 
   * @returns This Account, for chainning.
   */
  public setName(name: string): Account {
    this.payload.name = name;
    return this;
  }

  /**
   * @returns The name of this account without spaces or special characters.
   */
  public getNormalizedName(): string {
    if (this.payload.normalizedName) {
      return this.payload.normalizedName;
    } else {
      return normalizeText(this.getName())
    }
  }

  /**
   * @returns The type for of this account.
   */
  public getType(): AccountType {
    return this.payload.type as AccountType;
  }

  /**
   * 
   * Sets the type of the Account.
   * 
   * @returns This Account, for chainning
   */
  public setType(type: AccountType): Account {
    this.payload.type = type;
    return this;
  }

  /**
   * Gets the custom properties stored in this Account.
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null ? { ...this.payload.properties } : {};
  }

  /**
   * Sets the custom properties of the Account
   * 
   * @param properties - Object with key/value pair properties
   * 
   * @returns This Account, for chainning. 
   */
  public setProperties(properties: { [key: string]: string }): Account {
    this.payload.properties = { ...properties };
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
      let value = this.payload.properties != null ? this.payload.properties[key] : null
      if (value != null && value.trim() != '') {
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
   * @returns This Account, for chainning. 
   */
  public setProperty(key: string, value: string | null): Account {
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
   * Delete a custom property
   * 
   * @param key - The property key
   * 
   * @returns This Account, for chainning. 
   */
  public deleteProperty(key: string): Account {
    this.setProperty(key, null);
    return this;
  }

  /**
   * Gets the balance based on credit nature of this Account.
   * @deprecated Use `Book.getBalancesReport` instead.
   * @returns The balance of this account.
   */
  public getBalance(): Amount {
    var balance = new Amount('0');
    if (this.payload.balance != null) {
      balance = round(this.payload.balance, this.book.getFractionDigits());
    }
    return balance;
  }

  /**
   * Gets the raw balance, no matter credit nature of this Account.
   * @deprecated Use `Book.getBalancesReport` instead.
   * @returns The balance of this account.
   */
  public getBalanceRaw(): Amount {
    var balance = new Amount('0');
    if (this.payload.balance != null) {
      balance = round(this.payload.balance, this.book.getFractionDigits());
    }
    return balance;
  }

  /**
   * Tell if this account is archived.
   */
  public isArchived(): boolean | undefined {
    return this.payload.archived;
  }

  /**
   * Set account archived/unarchived.
   * 
   * @returns This Account, for chainning.
   */
  public setArchived(archived: boolean): Account {
    this.payload.archived = archived;
    return this;
  }

  /**
   * Tell if the Account has any transaction already posted.
   * 
   * Accounts with transaction posted, even with zero balance, can only be archived.
   */
  public hasTransactionPosted(): boolean | undefined {
    return this.payload.hasTransactionPosted;
  }

  /**
   * 
   * Tell if the account is permanent.
   * 
   * Permanent Accounts are the ones which final balance is relevant and keep its balances over time.
   *  
   * They are also called [Real Accounts](http://en.wikipedia.org/wiki/Account_(accountancy)#Based_on_periodicity_of_flow)
   * 
   * Usually represents assets or tangibles, capable of being perceived by the senses or the mind, like bank accounts, money, debts and so on.
   * 
   * @returns True if its a permanent Account
   */
  public isPermanent(): boolean | undefined {
    return this.payload.permanent;
  }

  /**
   * Tell if the account has a Credit nature or Debit otherwise
   * 
   * Credit accounts are just for representation purposes. It increase or decrease the absolute balance. It doesn't affect the overall balance or the behavior of the system.
   * 
   * The absolute balance of credit accounts increase when it participate as a credit/origin in a transaction. Its usually for Accounts that increase the balance of the assets, like revenue accounts.
   * 
   * ```
   *         Crediting a credit
   *   Thus ---------------------> account increases its absolute balance
   *         Debiting a debit
   * 
   * 
   *         Debiting a credit
   *   Thus ---------------------> account decreases its absolute balance
   *         Crediting a debit
   * ```
   * 
   * As a rule of thumb, and for simple understanding, almost all accounts are Debit nature (NOT credit), except the ones that "offers" amount for the books, like revenue accounts.
   */
  public isCredit(): boolean | undefined {
    return this.payload.credit;
  }

  /**
   * Get the [[Groups]] of this account.
   */
  public async getGroups(): Promise<Group[]> {
    const id = this.getId();
    if (!id) {
      return [];
    }
    let groups = await GroupService.getGroupsByAccountId(this.book.getId(), id);
    let groupsObj = groups.map(group => new Group(this.book, group));
    return groupsObj;
  }

  /**
   * Sets the groups of the Account.
   * 
   * @returns This Account, for chainning.
   */
  public setGroups(groups: Group[] | bkper.Group[]): Account {
    this.payload.groups = undefined;
    if (groups != null) {
      groups.forEach(group => this.addGroup(group))
    }
    return this;
  }

  /**
   * Add a group to the Account.
   * 
   * @returns This Account, for chainning.
   */
  public addGroup(group: Group | bkper.Group): Account {
    if (!this.payload.groups) {
      this.payload.groups = [];
    }

    if (group instanceof Group) {
      this.payload.groups.push(group.json())
    } else {
      this.payload.groups.push(group)
    }

    return this;
  }

  /**
   * Remove a group from the Account.
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
   * Tell if this account is in the [[Group]]
   * 
   * @param  group - The Group name, id or object
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
   * Perform create new account.
   */
  public async create(): Promise<Account> {
    this.payload = await AccountService.createAccount(this.book.getId(), this.payload);
    this.updateAccountCache();
    return this;
  }

  /**
   * Perform update account, applying pending changes.
   */
  public async update(): Promise<Account> {
    this.payload = await AccountService.updateAccount(this.book.getId(), this.payload);
    this.updateAccountCache();
    return this;
  }

  /**
   * Perform delete account.
   */
  public async remove(): Promise<Account> {
    this.payload = await AccountService.deleteAccount(this.book.getId(), this.payload);
    this.updateAccountCache(true);
    return this;
  }

  /** @internal */
  private updateAccountCache(remove?: boolean): void {
    this.book.setAccount(this.payload, remove);
    this.book.clearCache();
  }

}
