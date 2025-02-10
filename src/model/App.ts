import { createApp, patchApp, updateApp } from "../service/app-service.js";

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
   * @returns The wrapped plain json object
   */
  public json(): bkper.App {
    return {...this.payload };
  }

  /**
   * 
   * Sets the webhook url for development.
   * 
   * @returns This App, for chainning.
   */
  public setWebhookUrlDev(webhookUrlDev: string): App {
    if (webhookUrlDev) {
      this.payload.webhookUrlDev = webhookUrlDev;
    } else {
      this.payload.webhookUrlDev = 'null';
    }
    return this;
  }

  /**
   * 
   * @returns The App universal identifier
   */
  public getId(): string | undefined {
    return this.payload.id;
  }

  /**
   * @return The name of this App
   */
  public getName(): string | undefined {
    return this.payload.name;
  }

  /**
   * @return The logo url of this App
   */
  public getLogoUrl(): string | undefined {
    return this.payload.logoUrl;
  }

  /**
   * @return The description of this App
   */
  public getDescription(): string | undefined {
    return this.payload.description;
  }

  /**
   * Sets the whitelabeled user emails
   * 
   * @returns This App for chaining
   */
  public setUserEmails(emails?: string): App {
    this.payload.userEmails = emails;
    return this;
  }

  /**
   * Sets the developer email
   * 
   * @returns This App for chaining
   */
  public setDeveloperEmail(email?: string): App {
    this.payload.developerEmail = email;
    return this;
  }

  /**
   * Sets the client secret
   * 
   * @returns This App for chaining
   */
  public setClientSecret(clientSecret?: string): App {
    this.payload.clientSecret = clientSecret;
    return this;
  }

  /**
   * Sets the readme text
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
   */
  public async create(): Promise<App> {
    await createApp(this.payload);
    return this;
  }

  /**
   * Partially update an App, applying pending changes.
   */
  public async patch(): Promise<App> {
    await patchApp(this.payload);
    return this;
  }

  /**
   * Perform update App, applying pending changes.
   */
  public async update(): Promise<App> {
    await updateApp(this.payload);
    return this;
  }

}
