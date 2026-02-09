import { Account } from '../model/Account.js';
import { Group } from '../model/Group.js';
import { AccountType } from '../model/Enums.js';
import { convertInMatrix } from '../utils.js';

/**
 * A AccountsDataTableBuilder is used to setup and build two-dimensional arrays containing accounts.
 *
 * @public
 */
export class AccountsDataTableBuilder {
    private accounts: Account[];

    private shouldIncludeArchived: boolean;
    private shouldAddGroups: boolean;
    private shouldAddProperties: boolean;
    private shouldAddIds: boolean;

    private propertyKeys: string[];

    constructor(accounts: Account[]) {
        this.accounts = accounts;
        this.shouldIncludeArchived = false;
        this.shouldAddGroups = false;
        this.shouldAddProperties = false;
        this.shouldAddIds = false;
        this.propertyKeys = [];
    }

    /**
     * Defines whether the archived accounts should be included.
     *
     * @param include - Whether to include archived accounts
     *
     * @returns This builder with respective include archived option, for chaining.
     */
    public archived(include: boolean): AccountsDataTableBuilder {
        this.shouldIncludeArchived = include;
        return this;
    }

    /**
     * Defines whether include account groups.
     *
     * @param include - Whether to include groups
     *
     * @returns This builder with respective include groups option, for chaining.
     */
    public groups(include: boolean): AccountsDataTableBuilder {
        this.shouldAddGroups = include;
        return this;
    }

    /**
     * Defines whether include custom account properties.
     *
     * @param include - Whether to include properties
     *
     * @returns This builder with respective include properties option, for chaining.
     */
    public properties(include: boolean): AccountsDataTableBuilder {
        this.shouldAddProperties = include;
        return this;
    }

    /**
     * Defines whether include account ids.
     *
     * @param include - Whether to include ids
     *
     * @returns This builder with respective include ids option, for chaining.
     */
    public ids(include: boolean): AccountsDataTableBuilder {
        this.shouldAddIds = include;
        return this;
    }

    private getPropertyKeys(): string[] {
        if (this.propertyKeys.length === 0) {
            for (const account of this.accounts) {
                for (const key of account.getPropertyKeys()) {
                    if (this.propertyKeys.indexOf(key) <= -1) {
                        this.propertyKeys.push(key);
                    }
                }
            }
            this.propertyKeys = this.propertyKeys.sort();
        }
        return this.propertyKeys;
    }

    private getTypeIndex(type: AccountType): number {
        if (type === AccountType.ASSET) {
            return 0;
        }
        if (type === AccountType.LIABILITY) {
            return 1;
        }
        if (type === AccountType.INCOMING) {
            return 2;
        }
        return 3;
    }

    private async getMaxNumberOfGroups(): Promise<number> {
        let maxNumberOfGroups = 0;
        for (const account of this.accounts) {
            const groups = await account.getGroups();
            if (groups.length > maxNumberOfGroups) {
                maxNumberOfGroups = groups.length;
            }
        }
        return maxNumberOfGroups;
    }

    /**
     * Sorts groups for an account in hierarchy-path order:
     * 1. Hierarchical groups (those with parent or children) come first, ordered by:
     *    - Root group name (alphabetically)
     *    - Depth within the hierarchy (parent before child)
     * 2. Free groups (no parent and no children) come last, sorted alphabetically
     */
    private sortGroupsHierarchyPath_(groups: Group[]): Group[] {
        // Partition into hierarchical vs free groups
        const hierarchicalGroups: Group[] = [];
        const freeGroups: Group[] = [];

        for (const group of groups) {
            if (group.getParent() != null || group.hasChildren()) {
                hierarchicalGroups.push(group);
            } else {
                freeGroups.push(group);
            }
        }

        // Group hierarchical groups by their root
        const byRoot = new Map<string, Group[]>();
        for (const group of hierarchicalGroups) {
            const root = group.getRoot();
            const rootId = root.getId() || '';
            if (!byRoot.has(rootId)) {
                byRoot.set(rootId, []);
            }
            byRoot.get(rootId)!.push(group);
        }

        // Sort chains: first by root name alphabetically, then by depth within each chain
        const sortedChains = Array.from(byRoot.entries())
            .sort((a, b) => {
                const rootA = a[1][0].getRoot();
                const rootB = b[1][0].getRoot();
                return rootA.getNormalizedName().localeCompare(rootB.getNormalizedName());
            })
            .map(([_, chainGroups]) => chainGroups.sort((a, b) => a.getDepth() - b.getDepth()));

        // Sort free groups alphabetically
        freeGroups.sort((a, b) => a.getNormalizedName().localeCompare(b.getNormalizedName()));

        // Combine: hierarchical chains first, then free groups
        const result: Group[] = [];
        for (const chain of sortedChains) {
            result.push(...chain);
        }
        result.push(...freeGroups);

        return result;
    }

    /**
     * Builds a two-dimensional array containing all accounts.
     *
     * @returns A promise resolving to a two-dimensional array containing all accounts
     */
    public async build(): Promise<any[][]> {
        let table = new Array<Array<any>>();

        let accounts = this.accounts;

        if (!this.shouldIncludeArchived) {
            accounts = this.accounts.filter(a => !a.isArchived());
        }

        let headers: string[] = [];

        if (this.shouldAddIds) {
            headers.push('Account Id');
        }

        headers.push('Name');
        headers.push('Type');

        if (this.shouldAddGroups) {
            const maxGroups = await this.getMaxNumberOfGroups();
            for (let i = 0; i < maxGroups; i++) {
                headers.push('Group');
            }
        }

        accounts.sort((a1: Account, a2: Account) => {
            let ret = this.getTypeIndex(a1.getType()) - this.getTypeIndex(a2.getType());
            if (ret === 0) {
                ret = a1.getNormalizedName().localeCompare(a2.getNormalizedName());
            }
            return ret;
        });

        let propertyKeys: string[] = [];
        if (this.shouldAddProperties) {
            propertyKeys = this.getPropertyKeys();
        }

        for (const account of accounts) {
            const line: any[] = [];

            if (this.shouldAddIds) {
                line.push(account.getId());
            }

            line.push(account.getName());
            line.push(account.getType());

            if (this.shouldAddGroups) {
                const groups = this.sortGroupsHierarchyPath_(await account.getGroups());
                for (const group of groups) {
                    line.push(group.getName());
                }
            }

            if (this.shouldAddGroups && this.shouldAddProperties) {
                const numOfBlankCells = headers.length - line.length;
                for (let i = 0; i < numOfBlankCells; i++) {
                    line.push('');
                }
            }

            if (this.shouldAddProperties) {
                const properties = account.getProperties();
                for (const key of propertyKeys) {
                    const propertyValue = properties[key];
                    if (propertyValue) {
                        line.push(propertyValue);
                        continue;
                    }
                    line.push('');
                }
            }

            table.push(line);
        }

        if (this.shouldAddProperties) {
            headers = headers.concat(propertyKeys);
        }

        table.unshift(headers);

        convertInMatrix(table);

        return table;
    }
}
