import { Book } from "./Book.js";
import { App } from "./App.js";
import * as BookService from '../service/book-service.js';
import * as UserService from '../service/user-service.js';
import { HttpApiRequest } from '../service/http-api-request.js';
import { User } from "./User.js";
import { Config } from "./Config.js";

/**
 * This is the main entry point of the [bkper-js](https://www.npmjs.com/package/bkper-js) library.
 * 
 * You start by setting the API [[Config]] object.
 * 
 * Example:
 * 
 * ```javascript
 * Bkper.setConfig({
 *   apiKeyProvider: () => process.env.BKPER_API_KEY,
 *   oauthTokenProvider: () => process.env.BKPER_OAUTH_TOKEN
 * })
 * ```
 * 
 * Once the config is set, you can start using the library.
 * 
 * @public
 */
export class Bkper {

  /**
   * Gets the [[Book]] with the specified bookId from url param.
   *
   * @param id - The universal book id - The same bookId param of URL you access at app.bkper.com
   * 
   * @returns The retrieved Book, for chaining
   */
  public static async getBook(id: string): Promise<Book> {
    let book = await BookService.loadBook(id);
    return new Book(book);
  }

  /**
   * Gets the current logged [[User]].
   * 
   * @returns The retrieved User, for chaining
   */
  public static async getUser(): Promise<User> {
    let user = await UserService.getUser();
    return new User(user);
  }

  /**
   * Sets the API [[Config]] object.
   * 
   * @param config - The Config object
   */
  public static setConfig(config: Config) {
    HttpApiRequest.config = config;
  }

  /**
   * Sets the API key to identify the agent.
   * 
   * @param key - The API key
   * 
   * @returns The defined [[App]] object
   * 
   * @deprecated Use `setConfig()` instead
   */
  public static setApiKey(key: string): App {
    HttpApiRequest.config.apiKeyProvider = async () => key;
    return new App({});
  }

  /**
   * Sets the provider of the valid OAuth2 access token
   * 
   * @deprecated Use `setConfig()` instead
   */
  public static async setOAuthTokenProvider(oauthTokenProvider: () => Promise<string>) {
    HttpApiRequest.config.oauthTokenProvider = oauthTokenProvider;
  }

}
