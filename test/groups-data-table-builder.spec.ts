import { expect } from 'chai';
import { Group } from '../src/model/Group.js';
import { GroupsDataTableBuilder } from '../src/builders/GroupsDataTableBuilder.js';

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

describe('GroupsDataTableBuilder', () => {
    describe('basic table with no options', () => {
        it('should have headers [Name, Type, Parent] and rows for root groups + children', () => {
            const parentGroup = createGroup({
                id: '1',
                name: 'Assets',
                type: 'ASSET',
                permanent: true,
            });
            const childGroup = createGroup({
                id: '2',
                name: 'Bank',
                type: 'ASSET',
                permanent: true,
                parent: { id: '1' },
            });
            const rootGroup2 = createGroup({ id: '3', name: 'Revenue', type: 'INCOMING' });

            const groups = [parentGroup, childGroup, rootGroup2];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).build();

            // Header row
            expect(table[0]).to.eql(['Name', 'Type', 'Parent']);
            // Assets (root parent) should appear first (ASSET index=1 < INCOMING index=4)
            expect(table[1][0]).to.equal('Assets');
            expect(table[1][2]).to.equal('');
            // Bank (child of Assets) should follow via traversal
            expect(table[2][0]).to.equal('Bank');
            expect(table[2][2]).to.equal('Assets');
            // Revenue (root, no children)
            expect(table[3][0]).to.equal('Revenue');
            expect(table[3][2]).to.equal('');
            // Total: header + 3 data rows
            expect(table.length).to.equal(4);
        });
    });

    describe('properties(true)', () => {
        it('should add property columns after standard headers', () => {
            const g1 = createGroup({
                id: '1',
                name: 'Expenses',
                type: 'OUTGOING',
                properties: { color: 'red', tag: 'ops' },
            });
            const g2 = createGroup({
                id: '2',
                name: 'Utilities',
                type: 'OUTGOING',
                properties: { color: 'blue' },
            });

            const groups = [g1, g2];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).properties(true).build();

            // Properties sorted alphabetically: color, tag
            expect(table[0]).to.eql(['Name', 'Type', 'Parent', 'color', 'tag']);
            // g1 row (Expenses comes before Utilities alphabetically)
            expect(table[1][3]).to.equal('red');
            expect(table[1][4]).to.equal('ops');
            // g2 row
            expect(table[2][3]).to.equal('blue');
            expect(table[2][4]).to.equal('');
        });
    });

    describe('ids(true)', () => {
        it('should add Group Id column as the first column', () => {
            const g = createGroup({ id: 'abc123', name: 'Cash', type: 'ASSET', permanent: true });
            const groups = [g];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).ids(true).build();

            expect(table[0][0]).to.equal('Group Id');
            expect(table[0]).to.eql(['Group Id', 'Name', 'Type', 'Parent']);
            expect(table[1][0]).to.equal('abc123');
            expect(table[1][1]).to.equal('Cash');
        });
    });

    describe('hiddenProperties', () => {
        it('properties(true) should exclude hidden properties by default', () => {
            const g1 = createGroup({
                id: '1',
                name: 'Expenses',
                type: 'OUTGOING',
                properties: { color: 'red', agent_id_: 'hidden-val' },
            });

            const groups = [g1];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).properties(true).build();

            expect(table[0]).to.include('color');
            expect(table[0]).to.not.include('agent_id_');
        });

        it('properties(true).hiddenProperties(true) should include hidden properties', () => {
            const g1 = createGroup({
                id: '1',
                name: 'Expenses',
                type: 'OUTGOING',
                properties: { color: 'red', agent_id_: 'hidden-val' },
            });

            const groups = [g1];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups)
                .properties(true)
                .hiddenProperties(true)
                .build();

            expect(table[0]).to.include('color');
            expect(table[0]).to.include('agent_id_');
        });
    });

    describe('sorting', () => {
        it('should sort by type index, then hasChildren (parents first), then alphabetically', () => {
            // ASSET (index 1) groups
            const assetParent = createGroup({
                id: '1',
                name: 'Zeta Assets',
                type: 'ASSET',
                permanent: true,
            });
            const assetChild = createGroup({
                id: '2',
                name: 'Alpha Child',
                type: 'ASSET',
                permanent: true,
                parent: { id: '1' },
            });
            const assetLeaf = createGroup({
                id: '3',
                name: 'Alpha Leaf',
                type: 'ASSET',
                permanent: true,
            });

            // OUTGOING (index 5) group
            const outgoingGroup = createGroup({ id: '4', name: 'Marketing', type: 'OUTGOING' });

            // INCOMING (index 4) group
            const incomingGroup = createGroup({ id: '5', name: 'Sales', type: 'INCOMING' });

            // Mixed ASSET_LIABILITY (index 0)
            const mixedPermanent = createGroup({ id: '6', name: 'Balance Sheet', permanent: true });

            const groups = [
                outgoingGroup,
                assetLeaf,
                incomingGroup,
                assetParent,
                assetChild,
                mixedPermanent,
            ];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).build();

            // Expected order of root groups:
            // 1. Balance Sheet (ASSET_LIABILITY, index 0, no children)
            // 2. Zeta Assets (ASSET, index 1, has children → parents first)
            //    2a. Alpha Child (child, via traversal)
            // 3. Alpha Leaf (ASSET, index 1, no children)
            // 4. Sales (INCOMING, index 4)
            // 5. Marketing (OUTGOING, index 5)
            expect(table[1][0]).to.equal('Balance Sheet');
            expect(table[2][0]).to.equal('Zeta Assets');
            expect(table[3][0]).to.equal('Alpha Child');
            expect(table[4][0]).to.equal('Alpha Leaf');
            expect(table[5][0]).to.equal('Sales');
            expect(table[6][0]).to.equal('Marketing');
        });
    });

    describe('hidden groups', () => {
        it('should exclude hidden groups from the table', () => {
            const visible = createGroup({
                id: '1',
                name: 'Visible',
                type: 'ASSET',
                permanent: true,
            });
            const hidden = createGroup({
                id: '2',
                name: 'Hidden',
                type: 'ASSET',
                permanent: true,
                hidden: true,
            });

            const groups = [visible, hidden];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).build();

            // Header + 1 data row (hidden excluded)
            expect(table.length).to.equal(2);
            expect(table[1][0]).to.equal('Visible');
        });
    });

    describe('child groups excluded from top level', () => {
        it('should not show child groups as top-level rows', () => {
            const parent = createGroup({ id: '1', name: 'Parent', type: 'ASSET', permanent: true });
            const child = createGroup({
                id: '2',
                name: 'Child',
                type: 'ASSET',
                permanent: true,
                parent: { id: '1' },
            });

            const groups = [parent, child];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).build();

            // Header + Parent + Child (via traversal) = 3 rows
            expect(table.length).to.equal(3);
            // Child appears after parent via traversal, not as independent top-level
            expect(table[1][0]).to.equal('Parent');
            expect(table[2][0]).to.equal('Child');
            expect(table[2][2]).to.equal('Parent'); // parent column shows parent name
        });
    });

    describe('rows padded to equal length (convertInMatrix)', () => {
        it('should pad shorter rows with null to match the longest row', () => {
            const g1 = createGroup({
                id: '1',
                name: 'G1',
                type: 'ASSET',
                permanent: true,
                properties: { extra: 'val' },
            });
            const g2 = createGroup({ id: '2', name: 'G2', type: 'ASSET', permanent: true });

            const groups = [g1, g2];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).properties(true).build();

            // All rows should have the same length
            const maxLen = Math.max(...table.map((row: any[]) => row.length));
            for (const row of table) {
                expect(row.length).to.equal(maxLen);
            }
        });
    });

    describe('mixed type groups', () => {
        it('should derive type string from isPermanent when type is not set', () => {
            const permanentMixed = createGroup({ id: '1', name: 'All Permanent', permanent: true });
            const nonPermanentMixed = createGroup({ id: '2', name: 'All Temporary' });

            const groups = [permanentMixed, nonPermanentMixed];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).build();

            // permanentMixed → ASSET_LIABILITY (index 0), comes first
            expect(table[1][0]).to.equal('All Permanent');
            expect(table[1][1]).to.equal('ASSET_LIABILITY');
            // nonPermanentMixed → INCOMING_OUTGOING (index 3)
            expect(table[2][0]).to.equal('All Temporary');
            expect(table[2][1]).to.equal('INCOMING_OUTGOING');
        });
    });

    describe('tree(true)', () => {
        it('should remove Parent column and indent child names', () => {
            const parent = createGroup({ id: '1', name: 'Assets', type: 'ASSET', permanent: true });
            const child = createGroup({
                id: '2',
                name: 'Bank',
                type: 'ASSET',
                permanent: true,
                parent: { id: '1' },
            });
            const root2 = createGroup({ id: '3', name: 'Revenue', type: 'INCOMING' });

            const groups = [parent, child, root2];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).tree(true).build();

            // Headers should not include Parent
            expect(table[0]).to.eql(['Name', 'Type']);
            // Root group — no indentation
            expect(table[1][0]).to.equal('Assets');
            // Child group — indented by 2 spaces
            expect(table[2][0]).to.equal('  Bank');
            // Another root — no indentation
            expect(table[3][0]).to.equal('Revenue');
        });

        it('should indent multiple levels of depth', () => {
            const root = createGroup({ id: '1', name: 'Root', type: 'ASSET', permanent: true });
            const child = createGroup({
                id: '2',
                name: 'Child',
                type: 'ASSET',
                permanent: true,
                parent: { id: '1' },
            });
            const grandchild = createGroup({
                id: '3',
                name: 'Grandchild',
                type: 'ASSET',
                permanent: true,
                parent: { id: '2' },
            });

            const groups = [root, child, grandchild];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).tree(true).build();

            expect(table[1][0]).to.equal('Root');
            expect(table[2][0]).to.equal('  Child');
            expect(table[3][0]).to.equal('    Grandchild');
        });

        it('should work with ids(true)', () => {
            const parent = createGroup({
                id: 'p1',
                name: 'Parent',
                type: 'ASSET',
                permanent: true,
            });
            const child = createGroup({
                id: 'c1',
                name: 'Child',
                type: 'ASSET',
                permanent: true,
                parent: { id: 'p1' },
            });

            const groups = [parent, child];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).ids(true).tree(true).build();

            expect(table[0]).to.eql(['Group Id', 'Name', 'Type']);
            expect(table[1][0]).to.equal('p1');
            expect(table[1][1]).to.equal('Parent');
            expect(table[2][0]).to.equal('c1');
            expect(table[2][1]).to.equal('  Child');
        });

        it('should work with properties(true)', () => {
            const parent = createGroup({
                id: '1',
                name: 'Expenses',
                type: 'OUTGOING',
                properties: { color: 'red' },
            });
            const child = createGroup({
                id: '2',
                name: 'Utilities',
                type: 'OUTGOING',
                parent: { id: '1' },
                properties: { color: 'blue' },
            });

            const groups = [parent, child];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).tree(true).properties(true).build();

            expect(table[0]).to.eql(['Name', 'Type', 'color']);
            expect(table[1][0]).to.equal('Expenses');
            expect(table[1][2]).to.equal('red');
            expect(table[2][0]).to.equal('  Utilities');
            expect(table[2][2]).to.equal('blue');
        });

        it('should not indent root groups with no parent', () => {
            const g1 = createGroup({ id: '1', name: 'Alpha', type: 'ASSET', permanent: true });
            const g2 = createGroup({ id: '2', name: 'Beta', type: 'ASSET', permanent: true });

            const groups = [g1, g2];
            buildTree(groups);

            const table = new GroupsDataTableBuilder(groups).tree(true).build();

            expect(table[1][0]).to.equal('Alpha');
            expect(table[2][0]).to.equal('Beta');
        });
    });
});
