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

  public payload: bkper.Group;
  
  private parent?: Group;
  private depth?: number;
  private root?: Group;
  private children: Group[] = [];

  /** @internal */
  private book: Book;
  
  /** @internal */
  accounts?: Set<Account>;

  constructor(book: Book, payload?: bkper.Group) {
    this.book = book;
    this.payload = payload || {
      createdAt: `${Date.now()}`
    };
  }

  /**
   * @returns An immutable copy of the json payload
   */
  public json(): bkper.Group {
    return { ...this.payload };
  }
  
  /**
   * @returns The id of this Group
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * @returns The name of this Group
   */
  public getName(): string | undefined {
    return this.payload.name;
  }

  /**
   * Sets the name of the Group.
   * 
   * @returns This Group, for chainning.
   */
  public setName(name: string): Group {
    this.payload.name = name;
    return this;
  }

  /**
   * @returns The name of this group without spaces and special characters
   */
  public getNormalizedName(): string {
    if (this.payload.normalizedName) {
      return this.payload.normalizedName;
    } else {
      return normalizeText(this.getName())
    }
  }

  /**
   * @returns All Accounts of this group.
   */
  public async getAccounts(): Promise<Account[]> {

    if (this.accounts) {
      return Array.from(this.accounts);
    }

    let accountsPlain = await GroupService.getAccounts(this.book.getId(), this.getId());
    if (!accountsPlain) {
      return [];
    }
    let accounts = accountsPlain.map(acc => new Account(this.book, acc))
    return accounts;
  }

  /**
   * @returns The type for of the accounts of this group. Null if mixed
   */
  public getType(): AccountType {
    return this.payload.type as AccountType;
  }

  /**
   * Gets the custom properties stored in this Group
   */
  public getProperties(): { [key: string]: string } {
    return this.payload.properties != null ? { ...this.payload.properties } : {};
  }

  /**
   * Sets the custom properties of the Group
   * 
   * @param properties - Object with key/value pair properties
   * 
   * @returns This Group, for chainning. 
   */
  public setProperties(properties: { [key: string]: string }): Group {
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
   * Sets a custom property in the Group.
   * 
   * @param key - The property key
   * @param value - The property value
   */
  public setProperty(key: string, value: string | null): Group {
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
    return this.payload.hidden;
  }

  /**
   *  Hide/Show group on main menu.
   */
  public setHidden(hidden: boolean): Group {
    this.payload.hidden = hidden;
    return this;
  }

  /**
   * Tell if this is a credit (Incoming and Liabities) group
   */
  public isCredit(): boolean | undefined {
    return this.payload.credit;
  }

  /**
   * Tell if this is a mixed (Assets/Liabilities or Incoming/Outgoing) group
   */
  public isMixed(): boolean | undefined {
    return this.payload.mixed;
  }

  /**
   * Tell if the Group is permanent
   */
  public isPermanent(): boolean | undefined {
    return this.payload.permanent;
  }

  /**
   * @returns The parent Group
   */
  public getParent(): Group | undefined {
    return this.parent;
  }

  /**
   * Sets the parent Group.
   * 
   * @returns This Group, for chainning.
   */  
  public setParent(group: Group | null | undefined): Group {
    if (group) {
      this.payload.parent = {id: group.getId(), name: group.getName(), normalizedName: group.getNormalizedName()};
    } else {
      this.payload.parent = undefined;
    }
    return this;
  }

  /**
   * Checks if the Group has a parent.
   * 
   * @returns True if the Group has a parent, otherwise false.
   */
  public hasParent(): boolean {
    return this.payload.parent != null;
  }

  /**
   * Retrieves the children of the Group.
   * 
   * @returns An array of child Groups.
   */
  public getChildren(): Group[] {
    return this.children || [];
  }

  /**
   * Retrieves all descendant Groups of the current Group.
   * 
   * @returns A set of descendant Groups.
   */
  public getDescendants(): Set<Group> {
    const descendants = new Set<Group>();
    this.traverseDescendants(this, descendants);
    return descendants;
  }

  /**
   * Retrieves the IDs of all descendant Groups in a tree structure.
   * 
   * @returns A set of descendant Group IDs.
   */
  public getDescendantTreeIds(): Set<string> {
    return new Set(Array.from(this.getDescendants()).map(g => g.getId() || ""));
  }

  /**
   * Checks if the Group has any children.
   * 
   * @returns True if the Group has children, otherwise false.
   */
  public hasChildren(): boolean {
    return this.getChildren().length > 0;
  }

  /**
   * Checks if the Group is a leaf node (i.e., has no children).
   * 
   * @returns True if the Group is a leaf, otherwise false.
   */
  public isLeaf(): boolean {
    return this.getChildren().length === 0;
  }

  /**
   * Checks if the Group is a root node (i.e., has no parent).
   * 
   * @returns True if the Group is a root, otherwise false.
   */
  public isRoot(): boolean {
    return this.getParent() == undefined;
  }

  /**
   * Retrieves the depth of the Group in the hierarchy.
   * 
   * @returns The depth of the Group.
   */
  public getDepth(): number {
    if (this.depth == undefined) {
      if (this.parent) {
        this.depth = this.parent.getDepth() + 1;
      } else {
        this.depth = 0;
      }
    }
    return this.depth;
  }

  /**
   * Retrieves the root Group of the current Group.
   * 
   * @returns The root Group.
   */
  public getRoot(): Group {
    if (this.root == undefined) {
      if (this.parent != undefined) {
        this.root = this.parent.getRoot();
      } else {
        this.root = this;
      }
    }
    return this.root;
  }

  /**
   * Retrieves the name of the root Group.
   * 
   * @returns The name of the root Group.
   */
  public getRootName(): string {
    const root = this.getRoot();
    if (root != null) {
      return root.getName() || "";
    }
    return "";
  }


  /** @internal */
  private traverseDescendants(group: Group, descendants: Set<Group>): void {
    descendants.add(group);
    const children = group.getChildren();
    if (children.length > 0) {
      for (const child of children) {
        this.traverseDescendants(child, descendants);
      }
    }
  }
  

  /** @internal */
  buildGroupTree(groupsMap: Map<string, Group>): void {
    this.parent = undefined;
    this.depth = undefined;
    this.root = undefined;
    if (this.payload.parent) {
      const parentGroup = groupsMap.get(this.payload.parent.id || "");
      if (parentGroup) {
        this.parent = parentGroup;
        parentGroup.getChildren().push(this);
      }
    }
  }

  /** @internal */
  addAccount(account: Account): void {
    if (account == null) {
      return;
    }
    if (!this.accounts) {
      this.accounts = new Set<Account>();
    }
    this.accounts.add(account);
  }

  /**
   * @returns True if this group has any account in it
   */
  public hasAccounts(): boolean | undefined {
    return this.payload.hasAccounts;
  }





  /**
   * Perform create new group.
   */
  public async create(): Promise<Group> {
    this.payload = await GroupService.createGroup(this.book.getId(), this.payload);
    this.book.updateGroupCache(this);
    const bookGroupsMap = this.book.getGroupsMap();
    if (bookGroupsMap) {
      this.buildGroupTree(bookGroupsMap);
    }
    return this;
  }

  /**
   * Perform update group, applying pending changes.
   */
  public async update(): Promise<Group> {
    this.payload = await GroupService.updateGroup(this.book.getId(), this.payload);
    this.book.updateGroupCache(this);
    return this;

  }

  /**
   * Perform delete group.
   */
  public async remove(): Promise<Group> {
    this.payload = await GroupService.deleteGroup(this.book.getId(), this.payload);
    this.book.removeGroupCache(this);
    return this;
  }

}
