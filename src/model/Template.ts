
/**
 * This class defines a Template.
 * 
 * A Template is a pre-configured setup for [[Books]] and associated Google Sheets that provides users with a starting point for specific accounting or financial management needs.
 * 
 * @public
 */
export class Template {

    /** @internal */
    private wrapped: bkper.Template;

    constructor(json?: bkper.Template) {
        this.wrapped = json || {};
    }

    /**
     * Gets the name of the Template.
     * 
     * @returns The Template's name
     */
    public getName(): string | undefined {
        return this.wrapped.name;
    }

    /**
     * Gets the description of the Template.
     * 
     * @returns The Template's description
     */
    public getDescription(): string | undefined {
        return this.wrapped.description;
    }

    /**
     * Gets the url of the image of the Template.
     * 
     * @returns The url of the Template's image
     */
    public getImageUrl(): string | undefined {
        return this.wrapped.imageUrl;
    }

    /**
     * Gets the category of the Template.
     * 
     * @returns The Template's category. Example: "PERSONAL", "BUSINESS", etc
     */
    public getCategory(): string | undefined {
        return this.wrapped.category;
    }

    /**
     * Gets the times the Template has been used.
     * 
     * @returns The number of times the Template has been used
     */
    public getTimesUsed(): number {
        return this.wrapped.timesUsed || 0;
    }

    /**
     * Gets the bookId of the [[Book]] associated with the Template.
     * 
     * @returns The bookId of the Book associated with the Template
     */
    public getBookId(): string | undefined {
        return this.wrapped.bookId;
    }

    /**
     * Gets the link of the [[Book]] associated with the Template.
     * 
     * @returns The link of the Book associated with the Template
     */
    public getBookLink(): string | undefined {
        return this.wrapped.bookLink;
    }

    /**
     * Gets the link of the Google Sheets spreadsheet associated with the Template.
     * 
     * @returns The link of the Google Sheets spreadsheet associated with the Template
     */
    public getSheetsLink(): string | undefined {
        return this.wrapped.sheetsLink;
    }

    /**
     * Gets the wrapped plain json object of the Template.
     * 
     * @returns The Template wrapped plain json object
     */
    public json(): bkper.Template {
        return this.wrapped;
    }

}
