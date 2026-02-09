import { expect } from 'chai';
import { Book } from '../src/model/Book.js';
import { BooksDataTableBuilder } from '../src/builders/BooksDataTableBuilder.js';

function createBook(payload: bkper.Book): Book {
    return new Book(payload);
}

describe('BooksDataTableBuilder', () => {
    describe('basic table with no options', () => {
        it('should have headers [Name, Collection, Date Pattern, Decimal Separator, Fraction Digits, Period, Owner] and data rows', () => {
            const book = createBook({
                id: '1',
                name: 'My Book',
                datePattern: 'MM/dd/yyyy',
                decimalSeparator: 'DOT',
                fractionDigits: 2,
                period: 'MONTH',
                ownerName: 'John',
                collection: { name: 'Finance' },
            });

            const table = new BooksDataTableBuilder([book]).build();

            expect(table[0]).to.eql([
                'Name',
                'Collection',
                'Date Pattern',
                'Decimal Separator',
                'Fraction Digits',
                'Period',
                'Owner',
            ]);
            expect(table[1][0]).to.equal('My Book');
            expect(table[1][1]).to.equal('Finance');
            expect(table[1][2]).to.equal('MM/dd/yyyy');
            expect(table[1][3]).to.equal('DOT');
            expect(table[1][4]).to.equal(2);
            expect(table[1][5]).to.equal('MONTH');
            expect(table[1][6]).to.equal('John');
            expect(table.length).to.equal(2);
        });
    });

    describe('sorting', () => {
        it('should sort books with collection first (alphabetically), then books without collection', () => {
            const bookNoCollection = createBook({
                id: '1',
                name: 'Alpha Book',
            });
            const bookCollB = createBook({
                id: '2',
                name: 'Beta Book',
                collection: { name: 'Zebra' },
            });
            const bookCollA = createBook({
                id: '3',
                name: 'Gamma Book',
                collection: { name: 'Alpha' },
            });
            const bookCollA2 = createBook({
                id: '4',
                name: 'Delta Book',
                collection: { name: 'Alpha' },
            });

            const table = new BooksDataTableBuilder([
                bookNoCollection,
                bookCollB,
                bookCollA,
                bookCollA2,
            ]).build();

            // Alpha collection first (sorted by name within)
            expect(table[1][0]).to.equal('Delta Book');
            expect(table[1][1]).to.equal('Alpha');
            expect(table[2][0]).to.equal('Gamma Book');
            expect(table[2][1]).to.equal('Alpha');
            // Zebra collection next
            expect(table[3][0]).to.equal('Beta Book');
            expect(table[3][1]).to.equal('Zebra');
            // No collection last
            expect(table[4][0]).to.equal('Alpha Book');
            expect(table[4][1]).to.equal('');
        });
    });

    describe('ids(true)', () => {
        it('should add Book Id as the first column', () => {
            const book = createBook({
                id: 'abc123',
                name: 'Test Book',
                datePattern: 'dd/MM/yyyy',
                decimalSeparator: 'COMMA',
                fractionDigits: 0,
                period: 'YEAR',
                ownerName: 'Jane',
            });

            const table = new BooksDataTableBuilder([book]).ids(true).build();

            expect(table[0][0]).to.equal('Book Id');
            expect(table[0]).to.eql([
                'Book Id',
                'Name',
                'Collection',
                'Date Pattern',
                'Decimal Separator',
                'Fraction Digits',
                'Period',
                'Owner',
            ]);
            expect(table[1][0]).to.equal('abc123');
            expect(table[1][1]).to.equal('Test Book');
        });
    });

    describe('properties(true)', () => {
        it('should add property columns sorted alphabetically', () => {
            const book1 = createBook({
                id: '1',
                name: 'Book A',
                properties: { color: 'blue', category: 'ops' },
            });
            const book2 = createBook({
                id: '2',
                name: 'Book B',
                properties: { color: 'red' },
            });

            const table = new BooksDataTableBuilder([book1, book2]).properties(true).build();

            // Properties sorted alphabetically: category, color
            expect(table[0]).to.eql([
                'Name',
                'Collection',
                'Date Pattern',
                'Decimal Separator',
                'Fraction Digits',
                'Period',
                'Owner',
                'category',
                'color',
            ]);
            // book1 row
            expect(table[1][7]).to.equal('ops');
            expect(table[1][8]).to.equal('blue');
            // book2 row
            expect(table[2][7]).to.equal('');
            expect(table[2][8]).to.equal('red');
        });
    });

    describe('hiddenProperties', () => {
        it('properties(true) should exclude hidden properties by default', () => {
            const book = createBook({
                id: '1',
                name: 'Book A',
                properties: { color: 'blue', agent_id_: 'hidden-val' },
            });

            const table = new BooksDataTableBuilder([book]).properties(true).build();

            expect(table[0]).to.include('color');
            expect(table[0]).to.not.include('agent_id_');
        });

        it('properties(true).hiddenProperties(true) should include hidden properties', () => {
            const book = createBook({
                id: '1',
                name: 'Book A',
                properties: { color: 'blue', agent_id_: 'hidden-val' },
            });

            const table = new BooksDataTableBuilder([book])
                .properties(true)
                .hiddenProperties(true)
                .build();

            expect(table[0]).to.include('color');
            expect(table[0]).to.include('agent_id_');
        });
    });

    describe('combined ids + properties', () => {
        it('should add both Book Id and property columns', () => {
            const book = createBook({
                id: 'xyz',
                name: 'Combined Book',
                properties: { tag: 'finance' },
            });

            const table = new BooksDataTableBuilder([book]).ids(true).properties(true).build();

            expect(table[0]).to.eql([
                'Book Id',
                'Name',
                'Collection',
                'Date Pattern',
                'Decimal Separator',
                'Fraction Digits',
                'Period',
                'Owner',
                'tag',
            ]);
            expect(table[1][0]).to.equal('xyz');
            expect(table[1][1]).to.equal('Combined Book');
            expect(table[1][8]).to.equal('finance');
        });
    });

    describe('empty books array', () => {
        it('should return just the header row', () => {
            const table = new BooksDataTableBuilder([]).build();

            expect(table.length).to.equal(1);
            expect(table[0]).to.eql([
                'Name',
                'Collection',
                'Date Pattern',
                'Decimal Separator',
                'Fraction Digits',
                'Period',
                'Owner',
            ]);
        });
    });

    describe('books with no collection', () => {
        it('should show empty string in Collection column', () => {
            const book = createBook({
                id: '1',
                name: 'No Collection Book',
                datePattern: 'yyyy/MM/dd',
                decimalSeparator: 'DOT',
                fractionDigits: 4,
                ownerName: 'Alice',
            });

            const table = new BooksDataTableBuilder([book]).build();

            expect(table[1][0]).to.equal('No Collection Book');
            expect(table[1][1]).to.equal('');
        });
    });
});
