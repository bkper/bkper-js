import Big from "big.js";

/**
 * This class defines an Amount for arbitrary-precision decimal arithmetic.
 * 
 * It inherits methods from [big.js](http://mikemcl.github.io/big.js/) library
 * 
 * @public
 */
export class Amount {

  /** @internal */
  private big: Big;

  /**
   * The Amount constructor.
   *
   * @param n - The number, string, or Amount to initialize with
   */
  public constructor(n: number | string | Amount) {
    this.checkNumberNotNull(n);
    if (typeof n == "string") {
      this.big = new Big(n);
    } else if (n instanceof Amount) {
      this.big = new Big(n.big)
    } else if (n.toString) {
      this.big = new Big(n.toString())
    } else {
      this.big = new Big(+n);
    }
  }

  /** 
   * Returns an absolute Amount.
   *
   * @returns The absolute value as a new Amount
   */
  public abs(): Amount {
    let big = this.big.abs();
    return this.wrap(big)
  }

  /**
   * Compares this Amount with another value.
   *
   * @param n - The value to compare with
   *
   * @returns -1 if less than, 0 if equal, 1 if greater than
   */
  public cmp(n: number | string | Amount): -1 | 0 | 1 {
    this.checkNumberNotNull(n);
    if (typeof n == "string") {
      return this.big.cmp(n);
    } else if (n instanceof Amount) {
      return this.big.cmp(n.big)
    } else if (n.toString) {
      return this.big.cmp(n.toString())
    } else {
      return this.big.cmp(+n);
    }
  }

  /**
   * Divides this Amount by another value.
   *
   * @param n - The divisor value
   *
   * @returns The division result as a new Amount
   */
  public div(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    if (typeof n == "string") {
      big = this.big.div(n);
    } else if (n instanceof Amount) {
      big = this.big.div(n.big)
    } else if (n.toString) {
      big = this.big.div(n.toString())
    } else {
      big = this.big.div(+n);
    }
    return this.wrap(big);
  }

  /**
   * Checks if this Amount equals another value.
   *
   * @param n - The value to compare with
   *
   * @returns True if equal, false otherwise
   */
  public eq(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    if (typeof n == "string") {
      return this.big.eq(n);
    } else if (n instanceof Amount) {
      return this.big.eq(n.big)
    } else if (n.toString) {
      return this.big.eq(n.toString())
    } else {
      return this.big.eq(+n);
    }
  }

  /**
   * Checks if this Amount is greater than another value.
   *
   * @param n - The value to compare with
   *
   * @returns True if greater than, false otherwise
   */
  public gt(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    if (typeof n == "string") {
      return this.big.gt(n);
    } else if (n instanceof Amount) {
      return this.big.gt(n.big)
    } else if (n.toString) {
      return this.big.gt(n.toString())
    } else {
      return this.big.gt(+n);
    }
  }

  /**
   * Checks if this Amount is greater than or equal to another value.
   *
   * @param n - The value to compare with
   *
   * @returns True if greater than or equal, false otherwise
   */
  public gte(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    if (typeof n == "string") {
      return this.big.gte(n);
    } else if (n instanceof Amount) {
      return this.big.gte(n.big)
    } else if (n.toString) {
      return this.big.gte(n.toString())
    } else {
      return this.big.gte(+n);

    }
  }


  /**
   * Checks if this Amount is less than another value.
   *
   * @param n - The value to compare with
   *
   * @returns True if less than, false otherwise
   */
  public lt(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    if (typeof n == "string") {
      return this.big.lt(n);
    } else if (n instanceof Amount) {
      return this.big.lt(n.big)
    } else if (n.toString) {
      return this.big.lt(n.toString())
    } else {
      return this.big.lt(+n);
    }
  }


  /**
   * Checks if this Amount is less than or equal to another value.
   *
   * @param n - The value to compare with
   *
   * @returns True if less than or equal, false otherwise
   */
  public lte(n: number | string | Amount): boolean {
    this.checkNumberNotNull(n);
    if (typeof n == "string") {
      return this.big.lte(n);
    } else if (n instanceof Amount) {
      return this.big.lte(n.big)
    } else if (n.toString) {
      return this.big.lte(n.toString())
    } else {
      return this.big.lte(+n);
    }
  }

  /**
   * Adds another value to this Amount.
   *
   * @param n - The value to add
   *
   * @returns The sum as a new Amount
   */
  public plus(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    if (typeof n == "string") {
      big = this.big.plus(n);
    } else if (n instanceof Amount) {
      big = this.big.plus(n.big)
    } else if (n.toString) {
      big = this.big.plus(n.toString())
    } else {
      big = this.big.plus(+n);

    }
    return this.wrap(big);
  }

  /**
   * Subtracts another value from this Amount.
   *
   * @param n - The value to subtract
   *
   * @returns The difference as a new Amount
   */
  public minus(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    if (typeof n == "string") {
      big = this.big.minus(n);
    } else if (n instanceof Amount) {
      big = this.big.minus(n.big)
    } else if (n.toString) {
      big = this.big.minus(n.toString())
    } else {
      big = this.big.minus(+n);
    }
    return this.wrap(big);
  }

  /**
   * Calculates the modulo (remainder) of dividing this Amount by another value.
   * 
   * Similar to % operator
   *
   * @param n - The divisor value
   *
   * @returns The remainder as a new Amount
   */
  public mod(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    if (typeof n == "string") {
      big = this.big.mod(n);
    } else if (n instanceof Amount) {
      big = this.big.mod(n.big)
    } else if (n.toString) {
      big = this.big.mod(n.toString())
    } else {
      big = this.big.mod(+n);
    }
    return this.wrap(big);
  }


  /**
   * Rounds this Amount to a maximum of dp decimal places.
   *
   * @param dp - The number of decimal places (optional)
   *
   * @returns The rounded value as a new Amount
   */
  public round(dp?: number): Amount {
    let big = this.big.round(dp);
    return this.wrap(big);
  }



  /**
   * Multiplies this Amount by another value.
   *
   * @param n - The value to multiply by
   *
   * @returns The product as a new Amount
   */
  public times(n: number | string | Amount): Amount {
    this.checkNumberNotNull(n);
    let big: Big;
    if (typeof n == "string") {
      big = this.big.times(n);
    } else if (n instanceof Amount) {
      big = this.big.times(n.big)
    } else if (n.toString) {
      big = this.big.times(n.toString())
    } else {
      big = this.big.times(+n);
    }
    return this.wrap(big);
  }

  /**
   * Returns a string representing the value of this Amount in normal notation to a fixed number of decimal places.
   *
   * @param dp - The number of decimal places (optional)
   *
   * @returns The formatted string representation
   */
  public toFixed(dp?: number): string {
    return this.big.toFixed(dp);
  }

  /**
   * Returns a string representing the value of this Amount.
   *
   * @returns The string representation of this Amount
   */
  public toString(): string {
    return this.big.toString();
  }

  /**
   * Returns a primitive number representing the value of this Amount.
   *
   * @returns The numeric value of this Amount
   */
  public toNumber(): number {
    return this.big.toNumber();
  }


  /** @internal */
  private checkNumberNotNull(amount: string | number | Amount) {
    if (amount == null) {
      throw new Error(`Invalid number: null`);
    }
  }

  /** @internal */
  static create(): Amount {
    return Object.create(this.prototype);
  }

  /** @internal */
  private wrap(big: Big): Amount {
    let amount = Amount.create();
    amount.big = big;
    return amount;
  }
}