import { Book } from '../model/Book.js';
import { Account } from '../model/Account.js';
import { Transaction } from '../model/Transaction.js';
import { Amount } from '../model/Amount.js';
import { convertInMatrix, formatValue, getRepresentativeValue } from '../utils.js';

/**
 * A TransactionsDataTableBuilder is used to setup and build two-dimensional arrays containing transactions.
 *
 * @public
 */
export class TransactionsDataTableBuilder {
    private book: Book;
    private transactions: Transaction[];
    private account: Account | undefined;
    private shouldFormatDates: boolean = false;
    private shouldFormatValues: boolean = false;
    private shouldAddUrls: boolean = false;
    private shouldAddProperties: boolean = false;
    private shouldAddIds: boolean = false;
    private propertyKeys: string[] | undefined;
    private attachmentHeaders: string[] | undefined;
    private remoteIdHeaders: string[] | undefined;

    constructor(book: Book, transactions: Transaction[], account?: Account) {
        this.book = book;
        this.transactions = transactions;
        this.account = account;
    }

    /**
     * Defines whether the dates should be formatted, based on date pattern of the [[Book]].
     *
     * @param format - Whether to format dates
     *
     * @returns This builder with respective formatting option, for chaining.
     */
    public formatDates(format: boolean): TransactionsDataTableBuilder {
        this.shouldFormatDates = format;
        return this;
    }

    /**
     * Defines whether amounts should be formatted based on [[DecimalSeparator]] of the [[Book]].
     *
     * @param format - Whether to format values
     *
     * @returns This builder with respective formatting option, for chaining.
     */
    public formatValues(format: boolean): TransactionsDataTableBuilder {
        this.shouldFormatValues = format;
        return this;
    }

    /**
     * Defines whether include attachments and url links.
     *
     * @param include - Whether to include URLs
     *
     * @returns This builder with respective include attachment option, for chaining.
     */
    public includeUrls(include: boolean): TransactionsDataTableBuilder {
        this.shouldAddUrls = include;
        return this;
    }

    /**
     * Defines whether include custom transaction properties.
     *
     * @param include - Whether to include properties
     *
     * @returns This builder with respective include properties option, for chaining.
     */
    public includeProperties(include: boolean): TransactionsDataTableBuilder {
        this.shouldAddProperties = include;
        return this;
    }

    /**
     * Defines whether include transaction ids and remote ids.
     *
     * @param include - Whether to include ids
     *
     * @returns This builder with respective include ids option, for chaining.
     */
    public includeIds(include: boolean): TransactionsDataTableBuilder {
        this.shouldAddIds = include;
        return this;
    }

    /**
     * Gets the account used to filter transactions, when applicable.
     *
     * @returns The account, when filtering by a single account.
     */
    public getAccount(): Account | undefined {
        return this.account;
    }

    /**
     * Builds a two-dimensional array containing all transactions.
     *
     * @returns A promise resolving to a two-dimensional array containing all transactions
     */
    public async build(): Promise<any[][]> {
        const headerLine = this.getHeaderLine();
        const dataTable = await this.get2DArray_();

        if (dataTable.length > 0) {
            dataTable.splice(0, 0, headerLine);
            convertInMatrix(dataTable);
            return dataTable;
        } else {
            return [headerLine];
        }
    }

    private getHeaderLine(): string[] {
        const headerLine: string[] = [];

        if (this.shouldAddIds) {
            headerLine.push('Transaction Id');
        }

        headerLine.push('Status');
        headerLine.push('Date');
        headerLine.push('Origin');
        headerLine.push('Destination');
        headerLine.push('Description');
        headerLine.push('Amount');

        if (this.shouldShowBalances()) {
            headerLine.push('Balance');
        }

        headerLine.push('Recorded at');

        if (this.shouldAddProperties) {
            for (const key of this.getPropertyKeys()) {
                headerLine.push(key);
            }
        }

        if (this.shouldAddIds) {
            for (const remoteIdHeader of this.getRemoteIdHeaders()) {
                headerLine.push(remoteIdHeader);
            }
        }

        if (this.shouldAddUrls) {
            for (const attachmentHeader of this.getAttachmentHeaders()) {
                headerLine.push(attachmentHeader);
            }
        }

        return headerLine;
    }

    private async get2DArray_(): Promise<any[][]> {
        const dataTable: any[][] = [];

        for (const transaction of this.transactions) {
            const line: any[] = [];

            if (this.shouldAddIds) {
                line.push(transaction.getId());
            }

            line.push(transaction.getStatus());

            if (this.shouldFormatDates) {
                line.push(transaction.getDateFormatted());
            } else {
                line.push(transaction.getDateObject());
            }

            line.push(await transaction.getCreditAccountName());
            line.push(await transaction.getDebitAccountName());

            line.push(transaction.getDescription());

            let amount = transaction.getAmount();
            if (amount != null) {
                if (this.shouldShowBalances() && this.account) {
                    const isCreditOnTx = await this.isCreditOnTransaction_(
                        transaction,
                        this.account
                    );
                    amount = getRepresentativeValue(amount, !isCreditOnTx);
                }

                if (this.shouldFormatValues) {
                    line.push(
                        formatValue(
                            amount,
                            this.book.getDecimalSeparator(),
                            this.book.getFractionDigits()
                        )
                    );
                } else {
                    line.push(amount.toNumber());
                }
            } else {
                line.push('');
            }

            if (this.shouldShowBalances()) {
                const accountBalance = await transaction.getAccountBalance();
                if (accountBalance != null) {
                    if (this.shouldFormatValues) {
                        line.push(
                            formatValue(
                                accountBalance,
                                this.book.getDecimalSeparator(),
                                this.book.getFractionDigits()
                            )
                        );
                    } else {
                        line.push(accountBalance.toNumber());
                    }
                } else {
                    line.push('');
                }
            }

            if (this.shouldFormatDates) {
                line.push(transaction.getCreatedAtFormatted());
            } else {
                line.push(transaction.getCreatedAt());
            }

            if (this.shouldAddProperties) {
                this.addPropertiesToLine(line, transaction);
            }

            if (this.shouldAddIds) {
                this.addRemoteIdsToLine(line, transaction);
            }

            if (this.shouldAddUrls) {
                this.addUrlsToLine(line, transaction);
            }

            dataTable.push(line);
        }

        return dataTable;
    }

    private shouldShowBalances(): boolean {
        return this.account != null && this.account.isPermanent() === true;
    }

    private async isCreditOnTransaction_(
        transaction: Transaction,
        account: Account
    ): Promise<boolean> {
        const creditAccount = await transaction.getCreditAccount();
        if (account == null || creditAccount == null) {
            return false;
        }
        return creditAccount.getId() === account.getId();
    }

    private getPropertyKeys(): string[] {
        if (this.propertyKeys == null) {
            this.propertyKeys = [];
            for (const transaction of this.transactions) {
                for (const key of transaction.getPropertyKeys()) {
                    if (this.propertyKeys.indexOf(key) <= -1) {
                        this.propertyKeys.push(key);
                    }
                }
            }
            this.propertyKeys = this.propertyKeys.sort();
        }
        return this.propertyKeys;
    }

    private getAttachmentHeaders(): string[] {
        if (this.attachmentHeaders == null) {
            this.attachmentHeaders = [];
            for (const transaction of this.transactions) {
                const urls = this.getUrls(transaction);
                if (urls.length > this.attachmentHeaders.length) {
                    this.attachmentHeaders = [];
                    urls.forEach(() => this.attachmentHeaders!.push('Attachment'));
                }
            }
        }
        return this.attachmentHeaders;
    }

    private getRemoteIdHeaders(): string[] {
        if (this.remoteIdHeaders == null) {
            this.remoteIdHeaders = [];
            for (const transaction of this.transactions) {
                const remoteIds = transaction.getRemoteIds();
                if (remoteIds && remoteIds.length > this.remoteIdHeaders.length) {
                    this.remoteIdHeaders = [];
                    remoteIds.forEach(() => this.remoteIdHeaders!.push('Remote Id'));
                }
            }
        }
        return this.remoteIdHeaders;
    }

    private addPropertiesToLine(line: any[], transaction: Transaction): void {
        const lineLength = line.length;
        for (const key of this.getPropertyKeys()) {
            line.push('');
        }
        for (const key of transaction.getPropertyKeys()) {
            const index = this.getPropertyKeys().indexOf(key) + lineLength;
            line[index] = transaction.getProperty(key);
        }
    }

    private addRemoteIdsToLine(line: any[], transaction: Transaction): void {
        const lineLength = line.length;
        for (const key of this.getRemoteIdHeaders()) {
            line.push('');
        }
        const remoteIds = transaction.getRemoteIds();
        if (remoteIds) {
            for (let index = lineLength; index < lineLength + remoteIds.length; index++) {
                line[index] = remoteIds[index - lineLength];
            }
        }
    }

    private addUrlsToLine(line: any[], transaction: Transaction): void {
        const lineLength = line.length;
        for (const key of this.getAttachmentHeaders()) {
            line.push('');
        }
        const urls = this.getUrls(transaction);
        for (let index = lineLength; index < lineLength + urls.length; index++) {
            line[index] = urls[index - lineLength];
        }
    }

    private getUrls(transaction: Transaction): string[] {
        let urls = transaction.getUrls();
        if (urls == null) {
            urls = [];
        }
        const files = transaction.getFiles();
        if (files != null) {
            urls = urls.concat(
                files.map(f => f.getUrl()).filter((url): url is string => url != null)
            );
        }
        return urls;
    }
}
