import * as GroupService from "../service/group-service.js";
import { normalizeText } from "../utils.js";
import { Account } from "./Account.js";
import { Book } from "./Book.js";
import { Config } from "./Config.js";
import { AccountType } from "./Enums.js";
import { ResourceProperty } from "./ResourceProperty.js";

/**
 * This class defines a Group of [[Accounts]].
 *
 * Accounts can be grouped by different meaning, like Expenses, Revenue, Assets, Liabilities and so on
 *
 * Its useful to keep organized and for high level analysis.
 *
 * @public
 */
export class Group extends ResourceProperty<bkper.Group> {
    /** @internal */
    private parent?: Group;

    /** @internal */
    private depth?: number;

    /** @internal */
    private root?: Group;

    /** @internal */
    private children: Map<string, Group> = new Map();

    /** @internal */
    private book: Book;

    /** @internal */
    accounts?: Map<string, Account>;

    constructor(book: Book, payload?: bkper.Group) {
        super(payload || { createdAt: `${Date.now()}` });
        this.book = book;
    }

    /** @internal */
    public getConfig(): Config {
        return this.book.getConfig();
    }

    /**
     * Gets the id of this Group.
     *
     * @returns The id of this Group
     */
    public getId(): string | undefined {
        return this.payload.id;
    }

    /**
     * Gets the name of this Group.
     *
     * @returns The name of this Group
     */
    public getName(): string | undefined {
        return this.payload.name;
    }

    /**
     * Sets the name of the Group.
     *
     * @param name - The name to set
     *
     * @returns This Group, for chaining
     */
    public setName(name: string): Group {
        this.payload.name = name;
        return this;
    }

    /**
     * Tells if the balance of this Group has been verified/audited.
     *
     * @returns True if the balance of this Group has been verified/audited
     */
    public async isBalanceVerified(): Promise<boolean | undefined> {
        const accounts = await this.getAccounts();
        for (const account of accounts) {
            if (!account.isBalanceVerified()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Tells if the Group is locked by the Book owner.
     *
     * @returns True if the Group is locked
     */
    public isLocked(): boolean {
        if (this.payload.locked == null) {
            return false;
        }
        return this.payload.locked;
    }

    /**
     * Sets the locked state of the Group.
     *
     * @param locked - The locked state of the Group.
     *
     * @returns This Group, for chaining
     */
    public setLocked(locked: boolean): Group {
        this.payload.locked = locked;
        return this;
    }

    /**
     * Gets the normalized name of this group without spaces and special characters.
     *
     * @returns The name of this group without spaces and special characters
     */
    public getNormalizedName(): string {
        if (this.payload.normalizedName) {
            return this.payload.normalizedName;
        } else {
            return normalizeText(this.getName());
        }
    }

    /**
     * Gets all Accounts of this group.
     *
     * @returns All Accounts of this group
     */
    public async getAccounts(): Promise<Account[]> {
        if (this.accounts) {
            return Array.from(this.accounts.values());
        }

        const id = this.getId();
        if (!id) {
            return [];
        }
        let accountsPlain = await GroupService.getAccounts(
            this.book.getId(),
            id,
            this.getConfig()
        );
        if (!accountsPlain) {
            return [];
        }
        let accounts = accountsPlain.map((acc) => new Account(this.book, acc));
        return accounts;
    }

    /**
     * Gets the type of the accounts of this group.
     *
     * @returns The type for of the accounts of this group. Null if mixed
     */
    public getType(): AccountType {
        return this.payload.type as AccountType;
    }



    /**
     * Tells if the Group is hidden on main transactions menu.
     *
     * @returns True if the Group is hidden, false otherwise
     */
    public isHidden(): boolean | undefined {
        return this.payload.hidden;
    }

    /**
     * Hide/Show group on main menu.
     *
     * @param hidden - Whether to hide the group
     *
     * @returns This Group, for chaining
     */
    public setHidden(hidden: boolean): Group {
        this.payload.hidden = hidden;
        return this;
    }

    /**
     * Tells if this is a credit (Incoming and Liabilities) group.
     *
     * @returns True if this is a credit group
     */
    public isCredit(): boolean | undefined {
        return this.payload.credit;
    }

    /**
     * Tells if this is a mixed (Assets/Liabilities or Incoming/Outgoing) group.
     *
     * @returns True if this is a mixed group
     */
    public isMixed(): boolean | undefined {
        return this.payload.mixed;
    }

    /**
     * Tells if the Group is permanent.
     *
     * @returns True if the Group is permanent
     */
    public isPermanent(): boolean | undefined {
        return this.payload.permanent;
    }

    /**
     * Gets the parent Group.
     *
     * @returns The parent Group
     */
    public getParent(): Group | undefined {
        return this.parent;
    }

    /**
     * Sets the parent Group.
     *
     * @param group - The parent Group to set
     *
     * @returns This Group, for chaining
     */
    public setParent(group: Group | null | undefined): Group {
        if (group) {
            this.payload.parent = {
                id: group.getId(),
                name: group.getName(),
                normalizedName: group.getNormalizedName(),
            };
        } else {
            this.payload.parent = undefined;
        }
        return this;
    }

    /**
     * Checks if the Group has a parent.
     *
     * @returns True if the Group has a parent, otherwise false
     */
    public hasParent(): boolean {
        return this.payload.parent != null;
    }

    /**
     * Gets the children of the Group.
     *
     * @returns An array of child Groups
     */
    public getChildren(): Group[] {
        return Array.from(this.children.values()) || [];
    }

    /** @internal */
    private addChild(child: Group): void {
        const id = child.getId();
        if (id) {
            this.children.set(id, child);
        }
    }

    /**
     * Gets all descendant Groups of the current Group.
     *
     * @returns A set of descendant Groups
     */
    public getDescendants(): Set<Group> {
        const descendants = new Set<Group>();
        this.traverseDescendants(this, descendants);
        return descendants;
    }

    /**
     * Gets the IDs of all descendant Groups in a tree structure.
     *
     * @returns A set of descendant Group IDs
     */
    public getDescendantTreeIds(): Set<string> {
        return new Set(
            Array.from(this.getDescendants()).map((g) => g.getId() || "")
        );
    }

    /**
     * Checks if the Group has any children.
     *
     * @returns True if the Group has children, otherwise false
     */
    public hasChildren(): boolean {
        return this.getChildren().length > 0;
    }

    /**
     * Checks if the Group is a leaf node (i.e., has no children).
     *
     * @returns True if the Group is a leaf, otherwise false
     */
    public isLeaf(): boolean {
        return this.getChildren().length === 0;
    }

    /**
     * Checks if the Group is a root node (i.e., has no parent).
     *
     * @returns True if the Group is a root, otherwise false
     */
    public isRoot(): boolean {
        return this.getParent() == undefined;
    }

    /**
     * Gets the depth of the Group in the hierarchy.
     *
     * @returns The depth of the Group
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
     * Gets the root Group of the current Group.
     *
     * @returns The root Group
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
     * Gets the name of the root Group.
     *
     * @returns The name of the root Group
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
    buildGroupTree(idGroupMap: Map<string, Group>): void {
        this.parent = undefined;
        this.depth = undefined;
        this.root = undefined;
        if (this.payload.parent) {
            const parentGroup = idGroupMap.get(this.payload.parent.id || "");
            if (parentGroup) {
                this.parent = parentGroup;
                parentGroup.addChild(this);
            }
        }
    }

    /** @internal */
    addAccount(account: Account): void {
        const id = account?.getId();
        if (id) {
            if (!this.accounts) {
                this.accounts = new Map<string, Account>();
            }
            this.accounts.set(id, account);
        }
    }

    /**
     * Tells if this group has any account in it.
     *
     * @returns True if this group has any account in it
     */
    public hasAccounts(): boolean | undefined {
        return this.payload.hasAccounts;
    }

    /**
     * Performs create new group.
     *
     * @returns A promise that resolves to this Group
     */
    public async create(): Promise<Group> {
        this.payload = await GroupService.createGroup(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.updateGroupCache();
        return this;
    }

    /**
     * Performs update group, applying pending changes.
     *
     * @returns A promise that resolves to this Group
     */
    public async update(): Promise<Group> {
        this.payload = await GroupService.updateGroup(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.updateGroupCache();
        return this;
    }

    /**
     * Performs delete group.
     *
     * @returns A promise that resolves to this Group
     */
    public async remove(): Promise<Group> {
        this.payload = await GroupService.deleteGroup(
            this.book.getId(),
            this.payload,
            this.getConfig()
        );
        this.updateGroupCache(true);
        return this;
    }

    /** @internal */
    private updateGroupCache(remove?: boolean): void {
        this.book.setGroup(this.payload, remove);
        this.book.clearCache();
    }
}
