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
   */
  public abs(): Amount {
    let big = this.big.abs();
    return this.wrap(big)
  }

  /**
   * Compare
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
   * Divide by
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
   * Equals to
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
   * Greater than
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
   * Greater than or equal
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
   * Less than
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
   * Less than or equal to
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
   * Sum
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
   * Minus
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
   * Modulo - the integer remainder of dividing this Amount by n.
   * 
   * Similar to % operator
   *
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
   * Round to a maximum of dp decimal places.
   */
  public round(dp?: number): Amount {
    let big = this.big.round(dp);
    return this.wrap(big);
  }



  /**
   * Multiply
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
   * Returns a string representing the value of this Amount in normal notation to a fixed number of decimal places dp.
   */
  public toFixed(dp?: number): string {
    return this.big.toFixed(dp);
  }

  /**
   * Returns a string representing the value of this Amount.
   */
  public toString(): string {
    return this.big.toString();
  }

  /**
   * Returns a primitive number representing the value of this Amount.
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
  static create() {
    return Object.create(this.prototype);
  }

  /** @internal */
  private wrap(big: Big): Amount {
    let amount = Amount.create();
    amount.wrapped = big;
    return amount;
  }
}