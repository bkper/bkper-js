import { expect } from "chai";
import { Book } from "../src/model/Book.js";
import { Transaction } from "../src/model/Transaction.js";
import * as utils from "../src/utils.js";

describe('Transaction Tags', () => {

  describe('getTags()', () => {

    it('should return server tags when present, ignoring description hashtags', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: 'Payment #food #restaurant',
        tags: ['expense', 'business'],
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      expect(tags).to.deep.equal(['expense', 'business']);
      expect(tags).to.not.include('food');
      expect(tags).to.not.include('restaurant');
    });

    it('should extract tags from description when server tags empty and # present', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: 'Payment #food #restaurant',
        tags: [],
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      expect(tags).to.include('food');
      expect(tags).to.include('restaurant');
    });

    it('should extract tags from description when server tags undefined and # present', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: 'Expense #office #supplies',
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      expect(tags).to.include('office');
      expect(tags).to.include('supplies');
    });

    it('should return empty array when no server tags and no # in description', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: 'Regular payment without hashtags',
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      expect(tags).to.be.an('array');
      expect(tags).to.have.lengthOf(0);
    });

    it('should return empty array when description is empty and no server tags', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: '',
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      expect(tags).to.be.an('array');
      expect(tags).to.have.lengthOf(0);
    });

    it('should extract alphanumeric tags with underscores', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: 'Project #q1_2024 #client_abc #task123',
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      expect(tags).to.include('q1_2024');
      expect(tags).to.include('client_abc');
      expect(tags).to.include('task123');
    });

    it('should handle duplicate hashtags', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: 'Payment #food and more #food items',
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      const foodCount = tags.filter(t => t === 'food').length;
      expect(foodCount).to.equal(1);
    });

    it('should handle hashtags at start, middle, and end of description', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: '#start some text #middle more text #end',
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      expect(tags).to.include('start');
      expect(tags).to.include('middle');
      expect(tags).to.include('end');
    });

    it('should not extract # alone or # followed by space', () => {
      const book = new Book({ id: 'test-book' });
      const transaction = new Transaction(book, {
        description: 'Payment # 123 or # tag',
        createdAt: `${Date.now()}`
      });

      const tags = transaction.getTags();
      expect(tags).to.not.include('');
      expect(tags).to.not.include('123');
    });
  });

  describe('utils.extractTagsFromText()', () => {

    it('should extract basic hashtags', () => {
      const tags = utils.extractTagsFromText('Payment #food #restaurant');
      expect(tags).to.deep.equal(['food', 'restaurant']);
    });

    it('should extract hashtags with underscores and numbers', () => {
      const tags = utils.extractTagsFromText('#q1_2024 #client_123 #task_abc_456');
      expect(tags).to.deep.equal(['q1_2024', 'client_123', 'task_abc_456']);
    });

    it('should handle duplicate hashtags by keeping unique', () => {
      const tags = utils.extractTagsFromText('#food items #food again');
      expect(tags).to.deep.equal(['food']);
    });

    it('should return empty array when no hashtags', () => {
      const tags = utils.extractTagsFromText('No hashtags here');
      expect(tags).to.deep.equal([]);
    });

    it('should return empty array for empty string', () => {
      const tags = utils.extractTagsFromText('');
      expect(tags).to.deep.equal([]);
    });

    it('should return empty array for undefined', () => {
      const tags = utils.extractTagsFromText(undefined as any);
      expect(tags).to.deep.equal([]);
    });

    it('should handle hashtags at boundaries', () => {
      const tags = utils.extractTagsFromText('#start middle #end');
      expect(tags).to.deep.equal(['start', 'end']);
    });

    it('should stop at special characters except underscore', () => {
      const tags = utils.extractTagsFromText('#tag-name #tag.name #tag_name');
      expect(tags).to.include('tag_name');
      expect(tags).to.include('tag');
    });

    it('should handle multiple # in sequence', () => {
      const tags = utils.extractTagsFromText('##double #normal');
      expect(tags).to.include('normal');
    });
  });
});