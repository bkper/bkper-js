import { createApp, patchApp, updateApp } from "../service/app-service.js";

/**
 * Defines an App on Bkper.
 * 
 * Apps can be installed on Books by users.
 * 
 * @public
 */
export class App {

  /** @internal */
  private wrapped: bkper.App;

  constructor(json?: bkper.App) {
    this.wrapped = json || {};
  }

  /**
   * 
   * Sets the webhook url for development.
   * 
   * @returns This App, for chainning.
   */    
  public setWebhookUrlDev(webhookUrlDev: string): App {
    if (webhookUrlDev) {
      this.wrapped.webhookUrlDev = webhookUrlDev;
    } else {
      this.wrapped.webhookUrlDev = 'null';
    }
    return this;
  }


  /**
   * 
   * @returns The App universal identifier
   */
  public getId(): string | undefined {
    return this.wrapped.id;
  }

  /**
   * Sets the whitelabeled user emails
   * 
   * @returns This App for chaining
   */
  public setUserEmails(emails?: string): App {
    this.wrapped.userEmails = emails;
    return this;
  }

  /**
   * Sets the developer email
   * 
   * @returns This App for chaining
   */
  public setDeveloperEmail(email?: string): App {
    this.wrapped.developerEmail = email;
    return this;
  }

  /**
   * Sets the client secret
   * 
   * @returns This App for chaining
   */
  public setClientSecret(clientSecret?: string): App {
    this.wrapped.clientSecret = clientSecret;
    return this;
  }

  /**
   * Sets the readme text
   * 
   * @returns This App for chaining
   */
  public setReadme(readme?: string): App {
    this.wrapped.readme = readme;
    return this;
  }



  /**
   * Performs the app creation, applying pending changes.
   * 
   * The App id MUST be unique. If another app is already existing, an error will be thrown.
   */
  public async create(): Promise<App> {
    await createApp(this.wrapped);
    return this;
  }   

  /**
   * Partially update an App, applying pending changes.
   */
  public async patch(): Promise<App> {
    await patchApp(this.wrapped);
    return this;
  }  

  /**
   * Perform update App, applying pending changes.
   */
  public async update(): Promise<App> {
    await updateApp(this.wrapped);
    return this;
  }     
}