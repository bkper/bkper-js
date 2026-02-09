import { Book } from '../model/Book.js';
import { convertInMatrix } from '../utils.js';

/**
 * A BooksDataTableBuilder is used to setup and build two-dimensional arrays containing books.
 *
 * @public
 */
export class BooksDataTableBuilder {
    private books: Book[];
    private shouldAddProperties: boolean = false;
    private shouldAddIds: boolean = false;
    private shouldAddHiddenProperties: boolean = false;
    private propertyKeys: string[] = [];

    constructor(books: Book[]) {
        this.books = books;
    }

    /**
     * Defines whether to include custom book properties.
     *
     * @param include - Whether to include properties
     *
     * @returns This builder with respective include properties option, for chaining.
     */
    public properties(include: boolean): BooksDataTableBuilder {
        this.shouldAddProperties = include;
        return this;
    }

    /**
     * Defines whether to include book ids.
     *
     * @param include - Whether to include ids
     *
     * @returns This builder with respective include ids option, for chaining.
     */
    public ids(include: boolean): BooksDataTableBuilder {
        this.shouldAddIds = include;
        return this;
    }

    /**
     * Defines whether to include hidden properties (keys ending with underscore "_").
     * Only relevant when {@link properties} is enabled.
     * Default is false — hidden properties are excluded.
     *
     * @param include - Whether to include hidden properties
     *
     * @returns This builder with respective option, for chaining.
     */
    public hiddenProperties(include: boolean): BooksDataTableBuilder {
        this.shouldAddHiddenProperties = include;
        return this;
    }

    private mapPropertyKeys(): void {
        this.propertyKeys = [];
        for (const book of this.books) {
            for (const key of book.getPropertyKeys()) {
                if (!this.shouldAddHiddenProperties && key.endsWith('_')) {
                    continue;
                }
                if (this.propertyKeys.indexOf(key) <= -1) {
                    this.propertyKeys.push(key);
                }
            }
        }
        this.propertyKeys = this.propertyKeys.sort();
    }

    /**
     * Builds a two-dimensional array containing all Books.
     *
     * @returns A two-dimensional array containing all Books
     */
    public build(): any[][] {
        const table = new Array<Array<any>>();

        this.books.sort((a, b) => {
            const collA = a.getCollection()?.getName();
            const collB = b.getCollection()?.getName();
            // Books with collection before books without
            if (collA && !collB) return -1;
            if (!collA && collB) return 1;
            let ret = (collA || '').localeCompare(collB || '');
            if (ret === 0) {
                ret = (a.getName() || '').localeCompare(b.getName() || '');
            }
            return ret;
        });

        let headers: string[] = [];

        if (this.shouldAddIds) {
            headers.push('Book Id');
        }

        headers.push('Name');
        headers.push('Collection');
        headers.push('Date Pattern');
        headers.push('Decimal Separator');
        headers.push('Fraction Digits');
        headers.push('Period');
        headers.push('Owner');

        if (this.shouldAddProperties) {
            this.mapPropertyKeys();
            headers = headers.concat(this.propertyKeys);
        }

        for (const book of this.books) {
            const line: any[] = [];

            if (this.shouldAddIds) {
                line.push(book.getId());
            }

            line.push(book.getName() || '');
            line.push(book.getCollection()?.getName() || '');
            line.push(book.getDatePattern() || '');
            line.push(book.getDecimalSeparator() || '');
            line.push(book.getFractionDigits() ?? '');
            line.push(book.getPeriod() || '');
            line.push(book.getOwnerName() || '');

            if (this.shouldAddProperties) {
                const properties = book.getProperties();
                for (const key of this.propertyKeys) {
                    line.push(properties[key] || '');
                }
            }

            table.push(line);
        }

        table.unshift(headers);
        convertInMatrix(table);

        return table;
    }
}
