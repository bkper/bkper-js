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

  it('returns int64 transaction totals as numbers when the API serializes them as strings', () => {
    const billing = new Billing(
      JSON.parse('{"totalTransactionsThisMonth":"1200","totalTransactionsThisYear":"0"}') as bkper.Billing
    );

    expect(billing.getTotalTransactionsThisMonth()).to.equal(1200);
    expect(billing.getTotalTransactionsThisYear()).to.equal(0);
  });

  it('returns undefined transaction totals when the API omits them', () => {
    const billing = new Billing({});

    expect(billing.getTotalTransactionsThisMonth()).to.equal(undefined);
    expect(billing.getTotalTransactionsThisYear()).to.equal(undefined);
  });
});
