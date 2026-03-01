[Bkper REST API]: https://bkper.com/docs/#rest-api

[![npm](https://img.shields.io/npm/v/bkper-js?color=%235889e4)](https://www.npmjs.com/package/bkper-js)

bkper-js library is a simple and secure way to access the [Bkper REST API] on Node.js and modern browsers.

It provides a set of classes and functions to interact with the Bkper API, including authentication, authorization, and data manipulation.

## Documentation

- [Developer Docs](https://bkper.com/docs)
- [API Reference](https://bkper.com/docs/bkper-js/)

## Installation

### Add the package:

```bash tab="bun"
bun add bkper-js
```

```bash tab="npm"
npm i -S bkper-js
```

```bash tab="pnpm"
pnpm add bkper-js
```

```bash tab="yarn"
yarn add bkper-js
```

## Usage

### Node.js / CLI Scripts

For local scripts and CLI tools, use the [bkper](https://www.npmjs.com/package/bkper) CLI package for authentication:

```typescript
import { Bkper } from 'bkper-js';
import { getOAuthToken } from 'bkper';

// Configure with CLI authentication
Bkper.setConfig({
    oauthTokenProvider: async () => getOAuthToken(),
});

// Create Bkper instance
const bkper = new Bkper();

// Get a book and work with it
const book = await bkper.getBook('your-book-id');
console.log(`Book: ${book.getName()}`);

// List all books
const books = await bkper.getBooks();
console.log(`You have ${books.length} books`);
```

First, login via CLI: `bkper auth login`

### Web Applications

For browser-based apps, use the [@bkper/web-auth](https://www.npmjs.com/package/@bkper/web-auth) SDK:

```typescript
import { Bkper } from 'bkper-js';
import { BkperAuth } from '@bkper/web-auth';

// Initialize authentication
const auth = new BkperAuth({
    onLoginSuccess: () => initializeApp(),
    onLoginRequired: () => showLoginButton(),
});

// Restore session on app load
await auth.init();

// Configure Bkper with web auth
Bkper.setConfig({
    oauthTokenProvider: async () => auth.getAccessToken(),
});

// Create Bkper instance and use it
const bkper = new Bkper();
const books = await bkper.getBooks();
```

See the [@bkper/web-auth documentation](https://bkper.com/docs/auth-sdk) for more details.

### API Key (Optional)

API keys are optional and only needed for dedicated quota limits. If not provided, requests use a shared managed quota via the Bkper API proxy.

```typescript
Bkper.setConfig({
    oauthTokenProvider: async () => getOAuthToken(),
    apiKeyProvider: async () => process.env.BKPER_API_KEY, // Optional - for dedicated quota
});
```
