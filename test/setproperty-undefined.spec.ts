import { Account } from '../src/model/Account.js';
import { Transaction } from '../src/model/Transaction.js';
import { Book } from '../src/model/Book.js';
import { Group } from '../src/model/Group.js';
import { File } from '../src/model/File.js';
import { Connection } from '../src/model/Connection.js';
import { Integration } from '../src/model/Integration.js';

import { expect } from "chai";

describe('setProperty with undefined/null', () => {

  describe('Account', () => {
    it('should set property to empty string when value is undefined', () => {
      const account = new Account({ properties: {} } as any);
      account.setProperty('test_key', undefined);
      expect(account['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is null', () => {
      const account = new Account({ properties: {} } as any);
      account.setProperty('test_key', null);
      expect(account['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is empty string', () => {
      const account = new Account({ properties: {} } as any);
      account.setProperty('test_key', '');
      expect(account['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to actual value when provided', () => {
      const account = new Account({ properties: {} } as any);
      account.setProperty('test_key', 'actual_value');
      expect(account.getProperty('test_key')).to.equal('actual_value');
    });
  });

  describe('Transaction', () => {
    it('should set property to empty string when value is undefined', () => {
      const transaction = new Transaction({ properties: {} } as any);
      transaction.setProperty('test_key', undefined);
      expect(transaction['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is null', () => {
      const transaction = new Transaction({ properties: {} } as any);
      transaction.setProperty('test_key', null);
      expect(transaction['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is empty string', () => {
      const transaction = new Transaction({ properties: {} } as any);
      transaction.setProperty('test_key', '');
      expect(transaction['payload'].properties!['test_key']).to.equal('');
    });
  });

  describe('Book', () => {
    it('should set property to empty string when value is undefined', () => {
      const book = new Book(null as any, { properties: {} } as any);
      book.setProperty('test_key', undefined);
      expect(book['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is null', () => {
      const book = new Book(null as any, { properties: {} } as any);
      book.setProperty('test_key', null);
      expect(book['payload'].properties!['test_key']).to.equal('');
    });
  });

  describe('Group', () => {
    it('should set property to empty string when value is undefined', () => {
      const group = new Group({ properties: {} } as any);
      group.setProperty('test_key', undefined);
      expect(group['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is null', () => {
      const group = new Group({ properties: {} } as any);
      group.setProperty('test_key', null);
      expect(group['payload'].properties!['test_key']).to.equal('');
    });
  });

  describe('File', () => {
    it('should set property to empty string when value is undefined', () => {
      const file = new File({ properties: {} } as any);
      file.setProperty('test_key', undefined);
      expect(file['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is null', () => {
      const file = new File({ properties: {} } as any);
      file.setProperty('test_key', null);
      expect(file['payload'].properties!['test_key']).to.equal('');
    });
  });

  describe('Connection', () => {
    it('should set property to empty string when value is undefined', () => {
      const connection = new Connection({ properties: {} } as any);
      connection.setProperty('test_key', undefined);
      expect(connection['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is null', () => {
      const connection = new Connection({ properties: {} } as any);
      connection.setProperty('test_key', null);
      expect(connection['payload'].properties!['test_key']).to.equal('');
    });
  });

  describe('Integration', () => {
    it('should set property to empty string when value is undefined', () => {
      const integration = new Integration({ properties: {} } as any);
      integration.setProperty('test_key', undefined);
      expect(integration['payload'].properties!['test_key']).to.equal('');
    });

    it('should set property to empty string when value is null', () => {
      const integration = new Integration({ properties: {} } as any);
      integration.setProperty('test_key', null);
      expect(integration['payload'].properties!['test_key']).to.equal('');
    });
  });

});
