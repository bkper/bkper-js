
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
     * Gets the wrapped plain json object of the Template.
     * 
     * @returns The Template wrapped plain json object
     */
    public json(): bkper.Template {
        return this.wrapped;
    }

}
