import { expect } from 'chai';
import { Account } from '../src/model/Account.js';
import { Group } from '../src/model/Group.js';
import { Book } from '../src/model/Book.js';

/**
 * Creates a Book with groups in its cache, simulating the state after
 * book.getGroups() has been called (either explicitly or lazily).
 */
function createBookWithGroups(groupPayloads: bkper.Group[]): Book {
    const bookPayload: bkper.Book = {
        id: 'book1',
        groups: groupPayloads,
    };
    return new Book(bookPayload);
}

describe('Account.getGroups()', () => {
    describe('with groups in account payload', () => {
        it('should resolve groups from the book cache', async () => {
            const groupPayloads: bkper.Group[] = [
                { id: 'g1', name: 'Assets', permanent: true },
                { id: 'g2', name: 'Current Assets', permanent: true, parent: { id: 'g1' } },
            ];
            const book = createBookWithGroups(groupPayloads);

            const account = new Account(book, {
                id: 'a1',
                name: 'Cash',
                type: 'ASSET',
                groups: [{ id: 'g1' }, { id: 'g2' }],
            });

            const groups = await account.getGroups();

            expect(groups).to.have.length(2);
            expect(groups[0].getName()).to.equal('Assets');
            expect(groups[1].getName()).to.equal('Current Assets');
        });

        it('should return tree-linked Group objects with proper hierarchy', async () => {
            const groupPayloads: bkper.Group[] = [
                { id: 'g1', name: 'Costs', permanent: false },
                { id: 'g2', name: 'Operating', permanent: false, parent: { id: 'g1' } },
            ];
            const book = createBookWithGroups(groupPayloads);

            const account = new Account(book, {
                id: 'a1',
                name: 'Rent',
                type: 'OUTGOING',
                groups: [{ id: 'g2' }],
            });

            const groups = await account.getGroups();

            expect(groups).to.have.length(1);
            const operating = groups[0];
            expect(operating.getName()).to.equal('Operating');
            expect(operating.getParent()).to.not.be.null;
            expect(operating.getParent()!.getName()).to.equal('Costs');
        });

        it('should return all groups when account belongs to multiple groups', async () => {
            const groupPayloads: bkper.Group[] = [
                { id: 'g1', name: 'Assets', permanent: true },
                { id: 'g2', name: 'Current Assets', permanent: true, parent: { id: 'g1' } },
                { id: 'g3', name: 'Investments', permanent: true },
            ];
            const book = createBookWithGroups(groupPayloads);

            const account = new Account(book, {
                id: 'a1',
                name: 'Cash',
                type: 'ASSET',
                groups: [{ id: 'g1' }, { id: 'g2' }, { id: 'g3' }],
            });

            const groups = await account.getGroups();

            expect(groups).to.have.length(3);
            expect(groups[0].getName()).to.equal('Assets');
            expect(groups[1].getName()).to.equal('Current Assets');
            expect(groups[2].getName()).to.equal('Investments');
        });

        it('should return empty array when payload.groups is an empty array', async () => {
            const book = createBookWithGroups([]);

            const account = new Account(book, {
                id: 'a1',
                name: 'Cash',
                type: 'ASSET',
                groups: [],
            });

            const groups = await account.getGroups();

            expect(groups).to.have.length(0);
        });
    });

    describe('without groups in account payload', () => {
        it('should return empty array when account has no id (unsaved account)', async () => {
            const book = createBookWithGroups([]);

            const account = new Account(book, {
                name: 'Draft Account',
                type: 'ASSET',
            });

            const groups = await account.getGroups();

            expect(groups).to.deep.equal([]);
        });

        it('should return empty array when payload.groups is undefined', async () => {
            const book = createBookWithGroups([{ id: 'g1', name: 'Assets', permanent: true }]);

            // Account with an id but no groups property — e.g. locally constructed
            const account = new Account(book, {
                id: 'a1',
                name: 'Cash',
                type: 'ASSET',
            });

            const groups = await account.getGroups();

            expect(groups).to.deep.equal([]);
        });
    });

    describe('book group cache behavior', () => {
        it('should return the same Group instances from the book cache across accounts', async () => {
            const groupPayloads: bkper.Group[] = [
                { id: 'g1', name: 'Current Assets', permanent: true },
            ];
            const book = createBookWithGroups(groupPayloads);

            const account1 = new Account(book, {
                id: 'a1',
                name: 'Cash',
                type: 'ASSET',
                groups: [{ id: 'g1' }],
            });
            const account2 = new Account(book, {
                id: 'a2',
                name: 'Bank',
                type: 'ASSET',
                groups: [{ id: 'g1' }],
            });

            const groups1 = await account1.getGroups();
            const groups2 = await account2.getGroups();

            expect(groups1[0]).to.equal(groups2[0]); // Same instance from cache
        });

        it('should call book.getGroups() to ensure cache is populated', async () => {
            const groupPayloads: bkper.Group[] = [{ id: 'g1', name: 'Assets', permanent: true }];
            const book = createBookWithGroups(groupPayloads);

            let getGroupsCalled = false;
            const originalGetGroups = book.getGroups.bind(book);
            book.getGroups = async () => {
                getGroupsCalled = true;
                return originalGetGroups();
            };

            const account = new Account(book, {
                id: 'a1',
                name: 'Cash',
                type: 'ASSET',
                groups: [{ id: 'g1' }],
            });

            await account.getGroups();

            expect(getGroupsCalled).to.be.true;
        });

        it('should call book.getGroups() even when account has no groups in payload', async () => {
            const book = createBookWithGroups([]);

            let getGroupsCalled = false;
            const originalGetGroups = book.getGroups.bind(book);
            book.getGroups = async () => {
                getGroupsCalled = true;
                return originalGetGroups();
            };

            const account = new Account(book, {
                id: 'a1',
                name: 'Cash',
                type: 'ASSET',
            });

            await account.getGroups();

            expect(getGroupsCalled).to.be.true;
        });
    });
});
