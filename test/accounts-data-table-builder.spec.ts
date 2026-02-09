import { expect } from 'chai';
import { Account } from '../src/model/Account.js';
import { Group } from '../src/model/Group.js';
import { AccountType } from '../src/model/Enums.js';
import { AccountsDataTableBuilder } from '../src/builders/AccountsDataTableBuilder.js';

const mockBook = {} as any;

function createGroup(payload: bkper.Group): Group {
    return new Group(mockBook, payload);
}

function buildTree(groups: Group[]): void {
    const idMap = new Map<string, Group>();
    for (const g of groups) {
        const id = g.getId();
        if (id) idMap.set(id, g);
    }
    for (const g of groups) {
        g.buildGroupTree(idMap);
    }
}

function createAccount(payload: bkper.Account, groups: Group[] = []): Account {
    const account = new Account(mockBook, payload);
    // Override getGroups to return mock groups without API call
    account.getGroups = async () => groups;
    return account;
}

describe('AccountsDataTableBuilder', () => {
    describe('basic table with no options', () => {
        it('should have headers [Name, Type] and rows sorted by type then alphabetical', async () => {
            const accounts = [
                createAccount({ id: '1', name: 'Zeta', type: 'ASSET' }),
                createAccount({ id: '2', name: 'Alpha', type: 'ASSET' }),
                createAccount({ id: '3', name: 'Revenue', type: 'INCOMING' }),
            ];

            const table = await new AccountsDataTableBuilder(accounts).build();

            expect(table[0]).to.eql(['Name', 'Type']);
            // ASSET accounts sorted alphabetically
            expect(table[1]).to.eql(['Alpha', 'ASSET']);
            expect(table[2]).to.eql(['Zeta', 'ASSET']);
            // INCOMING after ASSET
            expect(table[3]).to.eql(['Revenue', 'INCOMING']);
            expect(table.length).to.equal(4);
        });
    });

    describe('archived(false)', () => {
        it('should exclude archived accounts', async () => {
            const accounts = [
                createAccount({ id: '1', name: 'Active', type: 'ASSET' }),
                createAccount({ id: '2', name: 'Archived', type: 'ASSET', archived: true }),
            ];

            const table = await new AccountsDataTableBuilder(accounts).archived(false).build();

            expect(table.length).to.equal(2); // header + 1 active
            expect(table[1][0]).to.equal('Active');
        });
    });

    describe('archived(true)', () => {
        it('should include archived accounts', async () => {
            const accounts = [
                createAccount({ id: '1', name: 'Active', type: 'ASSET' }),
                createAccount({ id: '2', name: 'Archived', type: 'ASSET', archived: true }),
            ];

            const table = await new AccountsDataTableBuilder(accounts).archived(true).build();

            expect(table.length).to.equal(3); // header + 2 accounts
        });
    });

    describe('groups(true)', () => {
        it('should add Group columns with group names sorted by hierarchy path', async () => {
            // Hierarchy: Costs -> Admin
            const costsGroup = createGroup({ id: 'g1', name: 'Costs', permanent: false });
            const adminGroup = createGroup({
                id: 'g2',
                name: 'Admin',
                permanent: false,
                parent: { id: 'g1' },
            });
            const freeGroup = createGroup({ id: 'g3', name: 'Taxable', permanent: false });

            const allGroups = [costsGroup, adminGroup, freeGroup];
            buildTree(allGroups);

            const accounts = [
                createAccount({ id: '1', name: 'Account A', type: 'ASSET' }, [
                    freeGroup,
                    adminGroup,
                    costsGroup,
                ]),
            ];

            const table = await new AccountsDataTableBuilder(accounts).groups(true).build();

            // 3 Group columns
            expect(table[0]).to.eql(['Name', 'Type', 'Group', 'Group', 'Group']);
            // Hierarchy first (Costs, Admin), then free (Taxable)
            expect(table[1]).to.eql(['Account A', 'ASSET', 'Costs', 'Admin', 'Taxable']);
        });

        it('should handle accounts with no groups', async () => {
            const freeGroup = createGroup({ id: 'g1', name: 'Expenses' });
            buildTree([freeGroup]);

            const accounts = [
                createAccount({ id: '1', name: 'Account A', type: 'ASSET' }, [freeGroup]),
                createAccount({ id: '2', name: 'Account B', type: 'ASSET' }, []),
            ];

            const table = await new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.eql(['Name', 'Type', 'Group']);
            expect(table[1]).to.eql(['Account A', 'ASSET', 'Expenses']);
            // Padded with null by convertInMatrix
            expect(table[2]).to.eql(['Account B', 'ASSET', null]);
        });
    });

    describe('properties(true)', () => {
        it('should add property columns after standard headers', async () => {
            const accounts = [
                createAccount({
                    id: '1',
                    name: 'Account A',
                    type: 'ASSET',
                    properties: { color: 'red', tag: 'ops' },
                }),
                createAccount({
                    id: '2',
                    name: 'Account B',
                    type: 'ASSET',
                    properties: { color: 'blue' },
                }),
            ];

            const table = await new AccountsDataTableBuilder(accounts).properties(true).build();

            // Properties sorted alphabetically: color, tag
            expect(table[0]).to.eql(['Name', 'Type', 'color', 'tag']);
            expect(table[1][2]).to.equal('red');
            expect(table[1][3]).to.equal('ops');
            expect(table[2][2]).to.equal('blue');
            expect(table[2][3]).to.equal('');
        });
    });

    describe('ids(true)', () => {
        it('should add Account Id as first column', async () => {
            const accounts = [createAccount({ id: 'abc123', name: 'Cash', type: 'ASSET' })];

            const table = await new AccountsDataTableBuilder(accounts).ids(true).build();

            expect(table[0]).to.eql(['Account Id', 'Name', 'Type']);
            expect(table[1][0]).to.equal('abc123');
            expect(table[1][1]).to.equal('Cash');
        });
    });

    describe('hiddenProperties', () => {
        it('properties(true) should exclude hidden properties by default', async () => {
            const accounts = [
                createAccount({
                    id: '1',
                    name: 'Account A',
                    type: 'ASSET',
                    properties: { color: 'red', agent_id_: 'hidden-val' },
                }),
            ];

            const table = await new AccountsDataTableBuilder(accounts).properties(true).build();

            expect(table[0]).to.include('color');
            expect(table[0]).to.not.include('agent_id_');
        });

        it('properties(true).hiddenProperties(true) should include hidden properties', async () => {
            const accounts = [
                createAccount({
                    id: '1',
                    name: 'Account A',
                    type: 'ASSET',
                    properties: { color: 'red', agent_id_: 'hidden-val' },
                }),
            ];

            const table = await new AccountsDataTableBuilder(accounts)
                .properties(true)
                .hiddenProperties(true)
                .build();

            expect(table[0]).to.include('color');
            expect(table[0]).to.include('agent_id_');
        });
    });

    describe('combined options', () => {
        it('should support ids + groups + properties together', async () => {
            const freeGroup = createGroup({ id: 'g1', name: 'Operations' });
            buildTree([freeGroup]);

            const accounts = [
                createAccount(
                    {
                        id: 'a1',
                        name: 'Account A',
                        type: 'ASSET',
                        properties: { dept: 'finance' },
                    },
                    [freeGroup]
                ),
            ];

            const table = await new AccountsDataTableBuilder(accounts)
                .ids(true)
                .groups(true)
                .properties(true)
                .build();

            expect(table[0]).to.eql(['Account Id', 'Name', 'Type', 'Group', 'dept']);
            expect(table[1][0]).to.equal('a1');
            expect(table[1][1]).to.equal('Account A');
            expect(table[1][2]).to.equal('ASSET');
            expect(table[1][3]).to.equal('Operations');
            expect(table[1][4]).to.equal('finance');
        });
    });

    describe('sorting', () => {
        it('should sort ASSET < LIABILITY < INCOMING < OUTGOING, then alphabetical within type', async () => {
            const accounts = [
                createAccount({ id: '1', name: 'Marketing', type: 'OUTGOING' }),
                createAccount({ id: '2', name: 'Sales', type: 'INCOMING' }),
                createAccount({ id: '3', name: 'Loans', type: 'LIABILITY' }),
                createAccount({ id: '4', name: 'Cash', type: 'ASSET' }),
                createAccount({ id: '5', name: 'Bank', type: 'ASSET' }),
                createAccount({ id: '6', name: 'Rent', type: 'OUTGOING' }),
            ];

            const table = await new AccountsDataTableBuilder(accounts).build();

            // ASSET accounts alphabetical
            expect(table[1][0]).to.equal('Bank');
            expect(table[1][1]).to.equal('ASSET');
            expect(table[2][0]).to.equal('Cash');
            expect(table[2][1]).to.equal('ASSET');
            // LIABILITY
            expect(table[3][0]).to.equal('Loans');
            expect(table[3][1]).to.equal('LIABILITY');
            // INCOMING
            expect(table[4][0]).to.equal('Sales');
            expect(table[4][1]).to.equal('INCOMING');
            // OUTGOING alphabetical
            expect(table[5][0]).to.equal('Marketing');
            expect(table[5][1]).to.equal('OUTGOING');
            expect(table[6][0]).to.equal('Rent');
            expect(table[6][1]).to.equal('OUTGOING');
        });
    });

    describe('sortGroupsHierarchyPath_', () => {
        it('should place hierarchical groups before free groups, sorted by root name then depth', async () => {
            // Hierarchy A: Costs -> Operating
            const costs = createGroup({ id: 'g1', name: 'Costs' });
            const operating = createGroup({
                id: 'g2',
                name: 'Operating',
                parent: { id: 'g1' },
            });

            // Hierarchy B: Revenue -> Sales
            const revenue = createGroup({ id: 'g3', name: 'Revenue' });
            const sales = createGroup({
                id: 'g4',
                name: 'Sales',
                parent: { id: 'g3' },
            });

            // Free groups
            const zebra = createGroup({ id: 'g5', name: 'Zebra' });
            const alpha = createGroup({ id: 'g6', name: 'Alpha' });

            const allGroups = [costs, operating, revenue, sales, zebra, alpha];
            buildTree(allGroups);

            const accounts = [
                createAccount({ id: '1', name: 'Test', type: 'ASSET' }, [
                    zebra,
                    sales,
                    alpha,
                    operating,
                    revenue,
                    costs,
                ]),
            ];

            const table = await new AccountsDataTableBuilder(accounts).groups(true).build();

            // Hierarchy chains first (Costs chain, then Revenue chain), then free groups alphabetically
            expect(table[1]).to.eql([
                'Test',
                'ASSET',
                'Costs',
                'Operating',
                'Revenue',
                'Sales',
                'Alpha',
                'Zebra',
            ]);
        });
    });

    describe('rows padded to equal length (convertInMatrix)', () => {
        it('should pad shorter rows with null to match the longest row', async () => {
            const g1 = createGroup({ id: 'g1', name: 'GroupA' });
            const g2 = createGroup({ id: 'g2', name: 'GroupB' });
            buildTree([g1, g2]);

            const accounts = [
                createAccount({ id: '1', name: 'Account A', type: 'ASSET' }, [g1, g2]),
                createAccount({ id: '2', name: 'Account B', type: 'ASSET' }, []),
            ];

            const table = await new AccountsDataTableBuilder(accounts).groups(true).build();

            // All rows should have the same length
            const maxLen = Math.max(...table.map((row: any[]) => row.length));
            for (const row of table) {
                expect(row.length).to.equal(maxLen);
            }
        });
    });
});
