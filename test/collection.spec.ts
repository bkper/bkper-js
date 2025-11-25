import { expect } from "chai";
import { Collection } from '../src/model/Collection.js';
import { Config } from '../src/model/Config.js';

describe('Collection', () => {

  describe('#getBooks()', () => {
    it('should return books with config', () => {
      const config: Config = {
        apiKeyProvider: async () => 'test-api-key'
      };

      const collection = new Collection({
        id: 'collection-1',
        name: 'Test Collection',
        books: [
          { id: 'book-1', name: 'Book 1' },
          { id: 'book-2', name: 'Book 2' }
        ]
      }, config);

      const books = collection.getBooks();

      expect(books).to.have.length(2);
      expect(books[0].getConfig()).to.equal(config);
      expect(books[1].getConfig()).to.equal(config);
    });
  });

});
