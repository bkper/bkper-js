import { Config } from "./Config.js";
import { Resource } from "./Resource.js";
import { Bkper } from "./Bkper.js";

/**
 *
 * This class defines the Backlog of a [[Book]].
 *
 * A Backlog is a list of pending tasks in a Book
 *
 * @public
 */
export class Backlog extends Resource<bkper.Backlog> {

  private config?: Config;

  constructor(payload?: bkper.Backlog, config?: Config) {
    super(payload);
    this.config = config;
  }

  /** @internal */
  public getConfig(): Config {
    return this.config || Bkper.globalConfig;
  }

  /**
   * Returns the number of pending tasks in this Backlog.
   *
   * @returns The number of tasks in the Backlog, or undefined if not available.
   */
  public getCount(): number | undefined {
    return this.payload.count;
  }

}
