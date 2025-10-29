import { Book } from "./Book.js";
import { App } from "./App.js";
import * as AppService from "../service/app-service.js";
import * as BookService from "../service/book-service.js";
import * as CollectionService from "../service/collection-service.js";
import * as UserService from "../service/user-service.js";
import * as TemplateService from "../service/template-service.js";
import { User } from "./User.js";
import { Config } from "./Config.js";
import { Template } from "./Template.js";
import { Collection } from "./Collection.js";

/**
 * This is the main entry point of the [bkper-js](https://www.npmjs.com/package/bkper-js) library.
 *
 * You can configure the library in two ways:
 *
 * 1. Using static configuration (traditional approach):
 * ```javascript
 * Bkper.setConfig({
 *   apiKeyProvider: () => process.env.BKPER_API_KEY,
 *   oauthTokenProvider: () => process.env.BKPER_OAUTH_TOKEN
 * });
 *
 * const bkper = new Bkper();
 * const book = await bkper.getBook('bookId');
 * ```
 *
 * 2. Using per-instance configuration (recommended for Cloudflare Workers):
 * ```javascript
 * const bkper = new Bkper({
 *   apiKeyProvider: () => process.env.BKPER_API_KEY,
 *   oauthTokenProvider: () => process.env.BKPER_OAUTH_TOKEN
 * });
 *
 * const book = await bkper.getBook('bookId');
 * ```
 *
 * @public
 */
export class Bkper {
    /** @internal */
    public static globalConfig: Config = {};

    private config: Config;

    /**
     * Sets the global API configuration for all Bkper operations.
     *
     * WARNING: This configuration will be shared and should NOT be used on shared environments.
     *
     * @param config - The Config object containing API key and OAuth token providers
     */
    public static setConfig(config: Config): void {
        Bkper.globalConfig = config;
    }

    /**
     * Creates a new Bkper instance with the provided configuration.
     *
     * @param config - The Config object containing API key and OAuth token providers.
     *                 If not provided, uses the global configuration set via setConfig().
     */
    constructor(config?: Config) {
        this.config = config || Bkper.globalConfig;
    }

    /**
     * Gets the [[Book]] with the specified bookId from url param.
     *
     * @param id - The universal book id - The same bookId param of URL you access at app.bkper.com
     * @param includeAccounts - Optional parameter to include accounts in the retrieved Book
     * @param includeGroups - Optional parameter to include groups in the retrieved Book
     *
     * If both includeAccounts and includeGroups are false, the Book will be returned with only the basic information.
     *
     * If includeAccounts is true, the Book will be returned with the accounts and groups.
     *
     * If includeGroups is true, the Book will be returned with the groups.
     *
     * @returns The retrieved Book
     */
    public async getBook(
        id: string,
        includeAccounts?: boolean,
        includeGroups?: boolean
    ): Promise<Book> {
        let book = await BookService.loadBook(
            id,
            includeAccounts,
            includeGroups,
            this.config
        );
        return new Book(book, this.config);
    }

    /**
     * Gets all [[Books]] the user has access to.
     *
     * @param query - Optional search term to filter books
     * @returns The retrieved list of Books
     */
    public async getBooks(query?: string): Promise<Book[]> {
        let books = await BookService.loadBooks(query, this.config);
        return books.map((book) => new Book(book, this.config));
    }

    /**
     * Gets all [[Collections]] the user has access to.
     *
     * @returns The retrieved list of Collections
     */
    public async getCollections(): Promise<Collection[]> {
        let collections = await CollectionService.loadCollections(this.config);
        return collections.map(
            (collection) => new Collection(collection, this.config)
        );
    }

    /**
     * Gets all [[Apps]] available for the user.
     *
     * @returns The retrieved list of Apps
     */
    public async getApps(): Promise<App[]> {
        let apps = await AppService.getApps(this.config);
        return apps.map((app) => new App(app));
    }

    /**
     * Gets all [[Templates]] available for the user.
     *
     * @returns The retrieved list of Templates
     */
    public async getTemplates(): Promise<Template[]> {
        let templates = await TemplateService.getTemplates(this.config);
        return templates.map((template) => new Template(template));
    }

    /**
     * Gets the current logged [[User]].
     *
     * @returns The retrieved User
     */
    public async getUser(): Promise<User> {
        let user = await UserService.getUser(this.config);
        return new User(user, this.config);
    }

    /**
     * Gets the URL to redirect the User to the billing portal.
     *
     * @param returnUrl - The URL to return to after the User has been redirected to the billing portal
     *
     * @returns The URL to redirect the User to the billing portal
     */
    public async getBillingPortalUrl(
        returnUrl: string
    ): Promise<string | undefined> {
        let url = await UserService.getBillingPortalUrl(returnUrl, this.config);
        return url.url;
    }
}
