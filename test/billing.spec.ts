import {expect} from 'chai';
import {Billing} from '../src/model/Billing.js';

describe('Billing', () => {
  it('returns authoritative transaction average and capacity', () => {
    const billing = new Billing({
      transactionsAverage: 2999.5,
      transactionsCapacity: 6000,
    });

    expect(billing.getTransactionsAverage()).to.equal(2999.5);
    expect(billing.getTransactionsCapacity()).to.equal(6000);
  });
});
