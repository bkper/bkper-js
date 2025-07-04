import * as AppService  from '../service/app-service.js';
import { EventType } from "./Enums.js";

/**
 * Defines an App on Bkper.
 * 
 * Apps can be installed on Books by users.
 * 
 * @public
 */
export class App {

  public payload: bkper.App;

  constructor(payload?: bkper.App) {
    this.payload = payload || {};
  }

  /**
   * Gets the wrapped plain JSON object.
   *
   * @returns The wrapped plain json object
   */
  public json(): bkper.App {
    return {...this.payload };
  }

  /**
   * Sets the webhook url for development.
   * 
   * @param webhookUrlDev - The webhook URL for development
   * 
   * @returns This App, for chaining
   */
  public setWebhookUrlDev(webhookUrlDev: string): App {
    this.payload.webhookUrlDev = webhookUrlDev;
    return this;
  }

  /**
   * Sets the conversation url for development.
   * 
   * @param conversationUrlDev - The conversation URL for development
   * 
   * @returns This App, for chaining
   */
  public setConversationUrlDev(conversationUrlDev: string): App {
    this.payload.conversationUrlDev = conversationUrlDev;
    return this;
  }

  /**
   * Gets the App universal identifier.
   *
   * @returns The App universal identifier
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * Gets the name of this App.
   *
   * @returns The name of this App
   */
  public getName(): string | undefined {
    return this.payload.name;
  }

  /**
   * Checks if this App has events bound to it.
   *
   * @returns True if this App has events bound to it
   */
  public hasEvents(): boolean {
    const events = this.getEvents() || [];
    return events.length > 0;
  }

  /**
   * Gets the events bound to this App.
   *
   * @returns The events bound to this App
   */
  public getEvents(): EventType[] | undefined {
    return this.payload.events as EventType[];
  }

  /**
   * Checks if this App is published.
   *
   * @returns True if this App is published
   */
  public isPublished(): boolean {
    return this.payload.published || false;
  }

  /**
   * Checks if this App is conversational.
   *
   * @returns True if this App is conversational
   */
  public isConversational(): boolean {
    return this.payload.conversational || false;
  }

  /**
   * Gets the logo url of this App.
   *
   * @returns The logo url of this App
   */
  public getLogoUrl(): string | undefined {
    return this.payload.logoUrl;
  }

  /**
   * Gets the logo url of this App in dark mode.
   *
   * @returns The logo url of this App in dark mode
   */
  public getLogoUrlDark(): string | undefined {
    return this.payload.logoUrlDark;
  }

  /**
   * Gets the description of this App.
   *
   * @returns The description of this App
   */
  public getDescription(): string | undefined {
    return this.payload.description;
  }

  /**
   * Sets the whitelabeled user emails.
   * 
   * @param emails - The user emails to whitelist
   * 
   * @returns This App for chaining
   */
  public setUserEmails(emails?: string): App {
    this.payload.userEmails = emails;
    return this;
  }

  /**
   * Gets the name of the owner of this App.
   *
   * @returns The name of the owner of this App
   */
  public getOwnerName(): string | undefined {
    return this.payload.ownerName;
  }

  /**
   * Gets the menu url of this App.
   *
   * @returns The menu url of this App
   */
  public getMenuUrl(): string | undefined {
    return this.payload.menuUrl;
  }

  /**
   * Gets the menu development url of this App.
   *
   * @returns The menu development url of this App
   */
  public getMenuUrlDev(): string | undefined {
    return this.payload.menuUrlDev;
  }

  /**
   * Gets the menu text of this App.
   *
   * @returns The menu text of this App
   */
  public getMenuText(): string | undefined {
    return this.payload.menuText;
  }

  /**
   * Gets the menu popup width of this App.
   *
   * @returns The menu popup width of this App
   */
  public getMenuPopupWidth(): string | undefined {
    return this.payload.menuPopupWidth;
  }

  /**
   * Gets the menu popup height of this App.
   *
   * @returns The menu popup height of this App
   */
  public getMenuPopupHeight(): string | undefined {
    return this.payload.menuPopupHeight;
  }

  /**
   * Gets the logo url of the owner of this App.
   *
   * @returns The logo url of the owner of this App
   */
  public getOwnerLogoUrl(): string | undefined {
    return this.payload.ownerLogoUrl;
  }

  /**
   * Gets the file patterns the App handles.
   *
   * @returns The file patterns the App handles - E.g *.pdf *.csv
   */
  public getFilePatterns(): string[] | undefined {
    return this.payload.filePatterns;
  }

  /**
   * Sets the developer email.
   * 
   * @param email - The developer email to set
   * 
   * @returns This App for chaining
   */
  public setDeveloperEmail(email?: string): App {
    this.payload.developerEmail = email;
    return this;
  }

  /**
   * Sets the client secret.
   * 
   * @param clientSecret - The client secret to set
   * 
   * @returns This App for chaining
   */
  public setClientSecret(clientSecret?: string): App {
    this.payload.clientSecret = clientSecret;
    return this;
  }

  /**
   * Sets the readme text.
   * 
   * @param readme - The readme text to set
   * 
   * @returns This App for chaining
   */
  public setReadme(readme?: string): App {
    this.payload.readme = readme;
    return this;
  }

  /**
   * Performs the app creation, applying pending changes.
   * 
   * The App id MUST be unique. If another app is already existing, an error will be thrown.
   *
   * @returns This App after creation
   */
  public async create(): Promise<App> {
    await AppService.createApp(this.payload);
    return this;
  }

  /**
   * Partially updates an App, applying pending changes.
   *
   * @returns This App after the partial update
   */
  public async patch(): Promise<App> {
    await AppService.patchApp(this.payload);
    return this;
  }

  /**
   * Performs a full update of the App, applying pending changes.
   *
   * @returns This App after the update
   */
  public async update(): Promise<App> {
    await AppService.updateApp(this.payload);
    return this;
  }

}
