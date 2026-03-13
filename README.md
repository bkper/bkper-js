[Bkper REST API]: https://bkper.com/docs/#rest-api

[![npm](https://img.shields.io/npm/v/bkper-js?color=%235889e4)](https://www.npmjs.com/package/bkper-js)

bkper-js library is a simple and secure way to access the [Bkper REST API] on Node.js and modern browsers.

It provides a set of classes and functions to interact with the Bkper API, including authentication, authorization, and data manipulation.

## Documentation

- [Developer Docs](https://bkper.com/docs)
- [API Reference](https://bkper.com/docs/bkper-js/)

## Installation

### Add the package:

```bash tab="npm"
npm i -S bkper-js
```

```bash tab="bun"
bun add bkper-js
```

```bash tab="pnpm"
pnpm add bkper-js
```

```bash tab="yarn"
yarn add bkper-js
```

## Usage

### CDN / Browser

The simplest way to use bkper-js in a browser — no build tools, no npm, just a `<script>` tag and a valid access token. Works on **any domain**.

```html
<script src="https://cdn.jsdelivr.net/npm/bkper-js@2/dist/bkper.min.js"></script>
<script>
    const { Bkper } = bkperjs;

    async function listBooks(token) {
        Bkper.setConfig({
            oauthTokenProvider: async () => token,
        });
        const bkper = new Bkper();
        return await bkper.getBooks();
    }

    // Example: prompt for a token and list books
    document.getElementById('go').addEventListener('click', async () => {
        const token = document.getElementById('token').value;
        const books = await listBooks(token);
        document.getElementById('output').textContent = books.map(b => b.getName()).join('\n');
    });
</script>

<input id="token" placeholder="Paste your access token" />
<button id="go">List Books</button>
<pre id="output"></pre>
```

Get an access token with the [Bkper CLI](https://www.npmjs.com/package/bkper):

```bash
bkper auth login   # one-time setup
bkper auth token   # prints a token (valid for 1 hour)
```

Pin to a specific version by replacing `@2` with e.g. `@2.31.0`.

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

### npm + Bundler

If you are using a bundler (Vite, webpack, esbuild, etc.), install from npm and provide an access token the same way as the CDN example:

```typescript
import { Bkper } from 'bkper-js';

Bkper.setConfig({
    oauthTokenProvider: async () => 'your-access-token',
});

const bkper = new Bkper();
const books = await bkper.getBooks();
```

### Web Applications on \*.bkper.app

> **Note:** `@bkper/web-auth` **only works on `*.bkper.app` subdomains**. Its session cookies are scoped to the `.bkper.app` domain and will not work on any other domain. For apps on other domains, use the [CDN / Browser](#cdn--browser) approach with an access token instead.

For apps hosted on `*.bkper.app` subdomains, use the [@bkper/web-auth](https://www.npmjs.com/package/@bkper/web-auth) SDK for built-in OAuth login flow:

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
