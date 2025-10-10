import { expect } from "chai";
import { Book } from "../src/model/Book.js";
import { Account } from "../src/model/Account.js";
import { Transaction } from "../src/model/Transaction.js";

describe('Transaction Clear Accounts', () => {

  let book: Book;
  let creditAccount: Account;
  let debitAccount: Account;

  beforeEach(() => {
    book = new Book({ id: 'test-book' });
    creditAccount = new Account(book, { id: 'credit-account-id', name: 'Credit Account' });
    debitAccount = new Account(book, { id: 'debit-account-id', name: 'Debit Account' });
  });

  describe('setCreditAccount()', () => {

    it('should clear credit account when passed null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setCreditAccount(creditAccount);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;

      transaction.setCreditAccount(null);
      expect(transaction['payload'].creditAccount).to.be.undefined;
    });

    it('should clear credit account when passed undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setCreditAccount(creditAccount);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;

      transaction.setCreditAccount(undefined);
      expect(transaction['payload'].creditAccount).to.be.undefined;
    });

    it('should not error when clearing already empty credit account with null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      expect(() => transaction.setCreditAccount(null)).to.not.throw();
      expect(transaction['payload'].creditAccount).to.be.undefined;
    });

    it('should not error when clearing already empty credit account with undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      expect(() => transaction.setCreditAccount(undefined)).to.not.throw();
      expect(transaction['payload'].creditAccount).to.be.undefined;
    });

    it('should allow setting valid account after clearing with null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setCreditAccount(creditAccount);
      transaction.setCreditAccount(null);
      transaction.setCreditAccount(creditAccount);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;
      expect(transaction['payload'].creditAccount?.id).to.equal('credit-account-id');
    });

    it('should allow setting valid account after clearing with undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setCreditAccount(creditAccount);
      transaction.setCreditAccount(undefined);
      transaction.setCreditAccount(creditAccount);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;
      expect(transaction['payload'].creditAccount?.id).to.equal('credit-account-id');
    });

    it('should support method chaining when clearing with null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      const result = transaction.setCreditAccount(creditAccount).setCreditAccount(null);
      expect(result).to.equal(transaction);
    });

    it('should support method chaining when clearing with undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      const result = transaction.setCreditAccount(creditAccount).setCreditAccount(undefined);
      expect(result).to.equal(transaction);
    });
  });

  describe('setDebitAccount()', () => {

    it('should clear debit account when passed null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setDebitAccount(debitAccount);
      expect(transaction['payload'].debitAccount).to.not.be.undefined;

      transaction.setDebitAccount(null);
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });

    it('should clear debit account when passed undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setDebitAccount(debitAccount);
      expect(transaction['payload'].debitAccount).to.not.be.undefined;

      transaction.setDebitAccount(undefined);
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });

    it('should not error when clearing already empty debit account with null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      expect(() => transaction.setDebitAccount(null)).to.not.throw();
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });

    it('should not error when clearing already empty debit account with undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      expect(() => transaction.setDebitAccount(undefined)).to.not.throw();
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });

    it('should allow setting valid account after clearing with null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setDebitAccount(debitAccount);
      transaction.setDebitAccount(null);
      transaction.setDebitAccount(debitAccount);
      expect(transaction['payload'].debitAccount).to.not.be.undefined;
      expect(transaction['payload'].debitAccount?.id).to.equal('debit-account-id');
    });

    it('should allow setting valid account after clearing with undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setDebitAccount(debitAccount);
      transaction.setDebitAccount(undefined);
      transaction.setDebitAccount(debitAccount);
      expect(transaction['payload'].debitAccount).to.not.be.undefined;
      expect(transaction['payload'].debitAccount?.id).to.equal('debit-account-id');
    });

    it('should support method chaining when clearing with null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      const result = transaction.setDebitAccount(debitAccount).setDebitAccount(null);
      expect(result).to.equal(transaction);
    });

    it('should support method chaining when clearing with undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      const result = transaction.setDebitAccount(debitAccount).setDebitAccount(undefined);
      expect(result).to.equal(transaction);
    });
  });

  describe('from() alias', () => {

    it('should clear credit account when passed null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.from(creditAccount);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;

      transaction.from(null);
      expect(transaction['payload'].creditAccount).to.be.undefined;
    });

    it('should clear credit account when passed undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.from(creditAccount);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;

      transaction.from(undefined);
      expect(transaction['payload'].creditAccount).to.be.undefined;
    });
  });

  describe('to() alias', () => {

    it('should clear debit account when passed null', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.to(debitAccount);
      expect(transaction['payload'].debitAccount).to.not.be.undefined;

      transaction.to(null);
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });

    it('should clear debit account when passed undefined', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.to(debitAccount);
      expect(transaction['payload'].debitAccount).to.not.be.undefined;

      transaction.to(undefined);
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });
  });

  describe('plain account object payload', () => {

    it('should clear credit account when passed null for plain account object', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      const plainAccount = { id: 'credit-account-id', name: 'Credit Account' };
      transaction.setCreditAccount(plainAccount);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;

      transaction.setCreditAccount(null);
      expect(transaction['payload'].creditAccount).to.be.undefined;
    });

    it('should clear debit account when passed null for plain account object', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      const plainAccount = { id: 'debit-account-id', name: 'Debit Account' };
      transaction.setDebitAccount(plainAccount);
      expect(transaction['payload'].debitAccount).to.not.be.undefined;

      transaction.setDebitAccount(null);
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });
  });

  describe('clearing both accounts', () => {

    it('should allow clearing both credit and debit accounts', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setCreditAccount(creditAccount);
      transaction.setDebitAccount(debitAccount);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;
      expect(transaction['payload'].debitAccount).to.not.be.undefined;

      transaction.setCreditAccount(null);
      transaction.setDebitAccount(null);
      expect(transaction['payload'].creditAccount).to.be.undefined;
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });

    it('should allow clearing only credit while keeping debit', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setCreditAccount(creditAccount);
      transaction.setDebitAccount(debitAccount);

      transaction.setCreditAccount(null);
      expect(transaction['payload'].creditAccount).to.be.undefined;
      expect(transaction['payload'].debitAccount).to.not.be.undefined;
      expect(transaction['payload'].debitAccount?.id).to.equal('debit-account-id');
    });

    it('should allow clearing only debit while keeping credit', () => {
      const transaction = new Transaction(book, { createdAt: `${Date.now()}` });
      transaction.setCreditAccount(creditAccount);
      transaction.setDebitAccount(debitAccount);

      transaction.setDebitAccount(null);
      expect(transaction['payload'].creditAccount).to.not.be.undefined;
      expect(transaction['payload'].creditAccount?.id).to.equal('credit-account-id');
      expect(transaction['payload'].debitAccount).to.be.undefined;
    });
  });
});
