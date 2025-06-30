[Bkper REST API]: https://bkper.com/docs/#rest-apis

[![npm](https://img.shields.io/npm/v/bkper-js?color=%235889e4)](https://www.npmjs.com/package/bkper-js)

bkper-js library is a simple and secure way to access the [Bkper REST API] on Node.js and modern browsers.

It provides a set of classes and functions to interact with the Bkper API, including authentication, authorization, and data manipulation.

## Documentation

- [Developer Docs](https://bkper.com/docs)
- [API Reference](https://bkper.com/docs/bkper-js/)

## Installation

### Add the package:

```
npm i -S bkper-js
```
or
```
yarn add bkper-js
```
or
```
bun add bkper-js
```

## Usage

```typescript
import { Bkper } from 'bkper-js';

// Create Bkper instance with configuration
const bkper = new Bkper({
  apiKeyProvider: () => process.env.BKPER_API_KEY,
  oauthTokenProvider: () => process.env.BKPER_OAUTH_TOKEN
});

// Get a book and work with it
const book = await bkper.getBook('your-book-id');
console.log(`Book: ${book.getName()}`);

// List all books
const books = await bkper.getBooks();
console.log(`You have ${books.length} books`);

// Get current user
const user = await bkper.getUser();
console.log(`Logged in as: ${user.getName()}`);
```


