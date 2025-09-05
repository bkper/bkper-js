import { Config } from "./Config.js";
import { Resource } from "./Resource.js";
import { Bkper } from "./Bkper.js";

/**
 * This class defines a Template.
 *
 * A Template is a pre-configured setup for [[Books]] and associated Google Sheets that provides users with a starting point for specific accounting or financial management needs.
 *
 * @public
 */
export class Template extends Resource<bkper.Template> {
  private config?: Config;

  constructor(json?: bkper.Template, config?: Config) {
    super(json);
    this.config = config;
  }

  /**
   * Gets the configuration object for this Template.
   *
   * @returns The Config object for this Template or the global config
   */
  public getConfig(): Config {
    return this.config || Bkper.globalConfig;
  }

  /**
   * Gets the name of the Template.
   *
   * @returns The Template's name
   */
  public getName(): string | undefined {
    return this.payload.name;
  }

  /**
   * Gets the description of the Template.
   *
   * @returns The Template's description
   */
  public getDescription(): string | undefined {
    return this.payload.description;
  }

  /**
   * Gets the url of the image of the Template.
   *
   * @returns The url of the Template's image
   */
  public getImageUrl(): string | undefined {
    return this.payload.imageUrl;
  }

  /**
   * Gets the category of the Template.
   *
   * @returns The Template's category. Example: "PERSONAL", "BUSINESS", etc
   */
  public getCategory(): string | undefined {
    return this.payload.category;
  }

  /**
   * Gets the times the Template has been used.
   *
   * @returns The number of times the Template has been used
   */
  public getTimesUsed(): number {
    return this.payload.timesUsed || 0;
  }

  /**
   * Gets the bookId of the [[Book]] associated with the Template.
   *
   * @returns The bookId of the Book associated with the Template
   */
  public getBookId(): string | undefined {
    return this.payload.bookId;
  }

  /**
   * Gets the link of the [[Book]] associated with the Template.
   *
   * @returns The link of the Book associated with the Template
   */
  public getBookLink(): string | undefined {
    return this.payload.bookLink;
  }

  /**
   * Gets the link of the Google Sheets spreadsheet associated with the Template.
   *
   * @returns The link of the Google Sheets spreadsheet associated with the Template
   */
  public getSheetsLink(): string | undefined {
    return this.payload.sheetsLink;
  }
}
