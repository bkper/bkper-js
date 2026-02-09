import { expect } from 'chai';
import { Transaction } from '../src/model/Transaction.js';
import { Account } from '../src/model/Account.js';
import { TransactionsDataTableBuilder } from '../src/builders/TransactionsDataTableBuilder.js';
import { DecimalSeparator } from '../src/model/Enums.js';
import { Amount } from '../src/model/Amount.js';

// Mock book with required methods
const mockBook = {
    getDecimalSeparator: () => DecimalSeparator.DOT,
    getFractionDigits: () => 2,
    getDatePattern: () => 'MM/dd/yyyy',
    getTimeZone: () => 'America/New_York',
    getTimeZoneOffset: () => -300,
    getAccount: async (id: any) => undefined,
} as any;

function createTransaction(payload: bkper.Transaction): Transaction {
    const t = new Transaction(mockBook, payload);
    // Override async methods to avoid API calls
    t.getCreditAccountName = async () => payload.creditAccount?.name || '';
    t.getDebitAccountName = async () => payload.debitAccount?.name || '';
    t.getCreditAccount = async () => {
        if (!payload.creditAccount) return undefined;
        return new Account(mockBook, payload.creditAccount);
    };
    t.getDebitAccount = async () => {
        if (!payload.debitAccount) return undefined;
        return new Account(mockBook, payload.debitAccount);
    };
    t.getAccountBalance = async () => {
        const caBalance = payload.creditAccount?.balance;
        const daBalance = payload.debitAccount?.balance;
        const balance = caBalance || daBalance;
        return balance ? new Amount(balance) : undefined;
    };
    return t;
}

function createAccount(payload: bkper.Account): Account {
    return new Account(mockBook, payload);
}

describe('TransactionsDataTableBuilder', () => {
    describe('basic table', () => {
        it('should have headers [Status, Date, Origin, Destination, Description, Amount, Recorded at] and verify data rows', async () => {
            const transactions = [
                createTransaction({
                    id: 't1',
                    posted: true,
                    checked: false,
                    dateValue: 20240115,
                    dateFormatted: '01/15/2024',
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Office supplies',
                    amount: '100.50',
                    createdAt: '1705000000000',
                }),
                createTransaction({
                    id: 't2',
                    posted: true,
                    checked: true,
                    dateValue: 20240116,
                    dateFormatted: '01/16/2024',
                    creditAccount: { id: 'a3', name: 'Revenue' },
                    debitAccount: { id: 'a1', name: 'Cash' },
                    description: 'Payment received',
                    amount: '500.00',
                    createdAt: '1705100000000',
                }),
            ];

            const table = await new TransactionsDataTableBuilder(mockBook, transactions).build();

            expect(table[0]).to.eql([
                'Status',
                'Date',
                'Origin',
                'Destination',
                'Description',
                'Amount',
                'Recorded at',
            ]);
            expect(table.length).to.equal(3); // header + 2 rows

            // First transaction
            expect(table[1][0]).to.equal('UNCHECKED');
            expect(table[1][1]).to.be.instanceOf(Date);
            expect(table[1][2]).to.equal('Cash');
            expect(table[1][3]).to.equal('Expenses');
            expect(table[1][4]).to.equal('Office supplies');
            expect(table[1][5]).to.equal(100.5);
            expect(table[1][6]).to.be.instanceOf(Date);

            // Second transaction
            expect(table[2][0]).to.equal('CHECKED');
            expect(table[2][5]).to.equal(500.0);
        });
    });

    describe('formatDates(true)', () => {
        it('should use formatted date string for Date column and formatted string for Recorded at', async () => {
            const transactions = [
                createTransaction({
                    id: 't1',
                    posted: true,
                    checked: false,
                    dateValue: 20240115,
                    dateFormatted: '01/15/2024',
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Test',
                    amount: '100',
                    createdAt: '1705000000000',
                }),
            ];

            const table = await new TransactionsDataTableBuilder(mockBook, transactions)
                .formatDates(true)
                .build();

            // Date column should be the formatted string
            expect(table[1][1]).to.equal('01/15/2024');
            // Recorded at should be a formatted string (not a Date object)
            expect(table[1][6]).to.be.a('string');
        });
    });

    describe('formatValues(true)', () => {
        it('should format amount with decimal separator', async () => {
            const transactions = [
                createTransaction({
                    id: 't1',
                    posted: true,
                    dateValue: 20240115,
                    dateFormatted: '01/15/2024',
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Test',
                    amount: '1234.50',
                    createdAt: '1705000000000',
                }),
            ];

            const table = await new TransactionsDataTableBuilder(mockBook, transactions)
                .formatValues(true)
                .build();

            // Amount should be formatted string with DOT separator
            expect(table[1][5]).to.equal('1234.50');
        });
    });

    describe('includeUrls(true)', () => {
        it('should add Attachment columns', async () => {
            const transactions = [
                createTransaction({
                    id: 't1',
                    posted: true,
                    dateValue: 20240115,
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'With attachment',
                    amount: '100',
                    createdAt: '1705000000000',
                    urls: ['https://example.com/receipt.pdf'],
                    files: [{ id: 'f1', url: 'https://example.com/file1.pdf' }],
                }),
                createTransaction({
                    id: 't2',
                    posted: true,
                    dateValue: 20240116,
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'No attachment',
                    amount: '50',
                    createdAt: '1705100000000',
                }),
            ];

            const table = await new TransactionsDataTableBuilder(mockBook, transactions)
                .includeUrls(true)
                .build();

            // Header should have 2 Attachment columns (1 url + 1 file)
            const headerAttachments = table[0].filter((h: string) => h === 'Attachment');
            expect(headerAttachments.length).to.equal(2);

            // First transaction should have both URLs
            const row1 = table[1];
            expect(row1[row1.length - 2]).to.equal('https://example.com/receipt.pdf');
            expect(row1[row1.length - 1]).to.equal('https://example.com/file1.pdf');
        });
    });

    describe('includeProperties(true)', () => {
        it('should add property columns sorted alphabetically', async () => {
            const transactions = [
                createTransaction({
                    id: 't1',
                    posted: true,
                    dateValue: 20240115,
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Test',
                    amount: '100',
                    createdAt: '1705000000000',
                    properties: { vendor: 'Acme', category: 'Office' },
                }),
                createTransaction({
                    id: 't2',
                    posted: true,
                    dateValue: 20240116,
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Test 2',
                    amount: '200',
                    createdAt: '1705100000000',
                    properties: { vendor: 'Beta' },
                }),
            ];

            const table = await new TransactionsDataTableBuilder(mockBook, transactions)
                .includeProperties(true)
                .build();

            // Properties sorted alphabetically: category, vendor
            const baseHeaders = [
                'Status',
                'Date',
                'Origin',
                'Destination',
                'Description',
                'Amount',
                'Recorded at',
            ];
            expect(table[0]).to.eql([...baseHeaders, 'category', 'vendor']);

            // First transaction has both properties
            expect(table[1][7]).to.equal('Office');
            expect(table[1][8]).to.equal('Acme');

            // Second transaction has only vendor
            expect(table[2][7]).to.equal('');
            expect(table[2][8]).to.equal('Beta');
        });
    });

    describe('includeIds(true)', () => {
        it('should add Transaction Id as first column and Remote Id columns at end', async () => {
            const transactions = [
                createTransaction({
                    id: 'tx-abc',
                    posted: true,
                    dateValue: 20240115,
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Test',
                    amount: '100',
                    createdAt: '1705000000000',
                    remoteIds: ['remote-1', 'remote-2'],
                }),
                createTransaction({
                    id: 'tx-def',
                    posted: true,
                    dateValue: 20240116,
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Test 2',
                    amount: '200',
                    createdAt: '1705100000000',
                    remoteIds: ['remote-3'],
                }),
            ];

            const table = await new TransactionsDataTableBuilder(mockBook, transactions)
                .includeIds(true)
                .build();

            // Transaction Id as first column
            expect(table[0][0]).to.equal('Transaction Id');
            expect(table[1][0]).to.equal('tx-abc');
            expect(table[2][0]).to.equal('tx-def');

            // Remote Id columns at end (max 2 remote ids)
            const remoteIdHeaders = table[0].filter((h: string) => h === 'Remote Id');
            expect(remoteIdHeaders.length).to.equal(2);

            // Verify remote id values
            const lastTwoHeaders = table[0].slice(-2);
            expect(lastTwoHeaders).to.eql(['Remote Id', 'Remote Id']);

            // First row has 2 remote ids
            expect(table[1][table[1].length - 2]).to.equal('remote-1');
            expect(table[1][table[1].length - 1]).to.equal('remote-2');

            // Second row has 1 remote id, second padded
            expect(table[2][table[2].length - 2]).to.equal('remote-3');
        });
    });

    describe('balance column with permanent account', () => {
        it('should show Balance column when account is permanent', async () => {
            const account = createAccount({
                id: 'a1',
                name: 'Cash',
                permanent: true,
                credit: false,
            });

            const transactions = [
                createTransaction({
                    id: 't1',
                    posted: true,
                    dateValue: 20240115,
                    creditAccount: { id: 'a1', name: 'Cash', balance: '900.00' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Payment',
                    amount: '100',
                    createdAt: '1705000000000',
                }),
            ];

            const table = await new TransactionsDataTableBuilder(
                mockBook,
                transactions,
                account
            ).build();

            expect(table[0]).to.include('Balance');
            const balanceIdx = table[0].indexOf('Balance');
            expect(balanceIdx).to.be.greaterThan(-1);

            // Balance should be a number
            expect(table[1][balanceIdx]).to.be.a('number');
        });
    });

    describe('no balance column', () => {
        it('should not show Balance column when no account', async () => {
            const transactions = [
                createTransaction({
                    id: 't1',
                    posted: true,
                    dateValue: 20240115,
                    creditAccount: { id: 'a1', name: 'Cash' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Test',
                    amount: '100',
                    createdAt: '1705000000000',
                }),
            ];

            const table = await new TransactionsDataTableBuilder(mockBook, transactions).build();

            expect(table[0]).to.not.include('Balance');
        });

        it('should not show Balance column when account is not permanent', async () => {
            const account = createAccount({ id: 'a1', name: 'Revenue', permanent: false });

            const transactions = [
                createTransaction({
                    id: 't1',
                    posted: true,
                    dateValue: 20240115,
                    creditAccount: { id: 'a1', name: 'Revenue' },
                    debitAccount: { id: 'a2', name: 'Cash' },
                    description: 'Test',
                    amount: '100',
                    createdAt: '1705000000000',
                }),
            ];

            const table = await new TransactionsDataTableBuilder(
                mockBook,
                transactions,
                account
            ).build();

            expect(table[0]).to.not.include('Balance');
        });
    });

    describe('empty transactions', () => {
        it('should return just header row', async () => {
            const table = await new TransactionsDataTableBuilder(mockBook, []).build();

            expect(table.length).to.equal(1);
            expect(table[0]).to.eql([
                'Status',
                'Date',
                'Origin',
                'Destination',
                'Description',
                'Amount',
                'Recorded at',
            ]);
        });
    });

    describe('combined options', () => {
        it('should support all options enabled together', async () => {
            const account = createAccount({
                id: 'a1',
                name: 'Cash',
                permanent: true,
                credit: false,
            });

            const transactions = [
                createTransaction({
                    id: 'tx-001',
                    posted: true,
                    checked: true,
                    dateValue: 20240115,
                    dateFormatted: '01/15/2024',
                    creditAccount: { id: 'a1', name: 'Cash', balance: '900.00' },
                    debitAccount: { id: 'a2', name: 'Expenses' },
                    description: 'Office supplies',
                    amount: '100.50',
                    createdAt: '1705000000000',
                    properties: { vendor: 'Acme', category: 'Office' },
                    remoteIds: ['ext-123'],
                    urls: ['https://example.com/receipt.pdf'],
                }),
            ];

            const table = await new TransactionsDataTableBuilder(mockBook, transactions, account)
                .formatDates(true)
                .formatValues(true)
                .includeUrls(true)
                .includeProperties(true)
                .includeIds(true)
                .build();

            // Verify header structure
            expect(table[0][0]).to.equal('Transaction Id');
            expect(table[0]).to.include('Status');
            expect(table[0]).to.include('Date');
            expect(table[0]).to.include('Origin');
            expect(table[0]).to.include('Destination');
            expect(table[0]).to.include('Description');
            expect(table[0]).to.include('Amount');
            expect(table[0]).to.include('Balance');
            expect(table[0]).to.include('Recorded at');
            expect(table[0]).to.include('category');
            expect(table[0]).to.include('vendor');
            expect(table[0]).to.include('Remote Id');
            expect(table[0]).to.include('Attachment');

            // Verify data row
            expect(table[1][0]).to.equal('tx-001'); // Transaction Id
            expect(table[1][1]).to.equal('CHECKED'); // Status
            expect(table[1][2]).to.equal('01/15/2024'); // Date (formatted)
            expect(table[1][3]).to.equal('Cash'); // Origin
            expect(table[1][4]).to.equal('Expenses'); // Destination

            // Amount should be formatted string
            const amountIdx = table[0].indexOf('Amount');
            expect(table[1][amountIdx]).to.be.a('string');

            // Balance should be formatted string
            const balanceIdx = table[0].indexOf('Balance');
            expect(table[1][balanceIdx]).to.be.a('string');
        });
    });
});
