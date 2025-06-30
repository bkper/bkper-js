import { Book } from "./Book.js";
import { App } from "./App.js";
import * as AppService from '../service/app-service.js';
import * as ConversationService from '../service/conversation-service.js';
import * as BookService from '../service/book-service.js';
import * as CollectionService from '../service/collection-service.js';
import * as UserService from '../service/user-service.js';
import * as TemplateService from '../service/template-service.js';
import { HttpApiRequest } from '../service/http-api-request.js';
import { User } from "./User.js";
import { Config } from "./Config.js";
import { Template } from "./Template.js";
import { Collection } from "./Collection.js";
import { Conversation } from "./Conversation.js";
import { Agent } from "./Agent.js";

/**
 * This is the main entry point of the [bkper-js](https://www.npmjs.com/package/bkper-js) library.
 * 
 * You start by setting the API [[Config]] object using the static setConfig method.
 * 
 * Example:
 * 
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
 * Once the config is set, you can create instances and start using the library.
 * 
 * @public
 */
export class Bkper {


  /**
   * Sets the global API configuration for all Bkper operations.
   * 
   * @param config - The Config object containing API key and OAuth token providers
   */
  public static setConfig(config: Config): void {
    HttpApiRequest.config = config;
  }

  /**
   * Creates a new Bkper instance using the global configuration set via setConfig().
   * Make sure to call Bkper.setConfig() before creating instances.
   */
  constructor() {
    // Uses global configuration set via setConfig()
  }

  /**
   * Gets the [[Book]] with the specified bookId from url param.
   *
   * @param id - The universal book id - The same bookId param of URL you access at app.bkper.com
   * @param includeAccounts - Optional parameter to include accounts in the retrieved Book
   * 
   * @returns The retrieved Book
   */
  public async getBook(id: string, includeAccounts?: boolean): Promise<Book> {
    let book = await BookService.loadBook(id, includeAccounts);
    return new Book(book);
  }

  /**
   * Gets all [[Books]] the user has access to.
   * 
   * @param query - Optional search term to filter books
   * @returns The retrieved list of Books
   */
  public async getBooks(query?: string): Promise<Book[]> {
    let books = await BookService.loadBooks(query);
    return books.map(book => new Book(book));
  }

  /**
   * Gets all [[Collections]] the user has access to.
   * 
   * @returns The retrieved list of Collections
   */
  public async getCollections(): Promise<Collection[]> {
    let collections = await CollectionService.loadCollections();
    return collections.map(collection => new Collection(collection));
  }

  /**
   * Gets all [[Apps]] available for the user.
   * 
   * @returns The retrieved list of Apps
   */
  public async getApps(): Promise<App[]> {
    let apps = await AppService.getApps();
    return apps.map(app => new App(app));
  }

  /**
   * Gets all [[Conversations]] available for the user.
   * 
   * @returns The retrieved list of Conversations
   */
  public async getConversations(): Promise<Conversation[]> {
    const conversationPayloads = await ConversationService.getConversations();
    let conversations: Conversation[] = [];
    for (const payload of conversationPayloads) {
      const agent = new Agent(payload.agent);
      const conversation = new Conversation(agent, payload);
      conversations.push(conversation);
    }
    return conversations;
  }

  /**
   * Gets all [[Templates]] available for the user.
   * 
   * @returns The retrieved list of Templates
   */
  public async getTemplates(): Promise<Template[]> {
    let templates = await TemplateService.getTemplates();
    return templates.map(template => new Template(template));
  }

  /**
   * Gets the current logged [[User]].
   * 
   * @returns The retrieved User
   */
  public async getUser(): Promise<User> {
    let user = await UserService.getUser();
    return new User(user);
  }

  /**
   * Gets the URL to redirect the User to the billing portal.
   * 
   * @param returnUrl - The URL to return to after the User has been redirected to the billing portal
   * 
   * @returns The URL to redirect the User to the billing portal
   */
  public async getBillingPortalUrl(returnUrl: string): Promise<string | undefined> {
    let url = await UserService.getBillingPortalUrl(returnUrl);
    return url.url;
  }



}
