import { getOAuthToken as getBkperCliOAuthToken } from "bkper";
import {
  Account,
  AccountType,
  Bkper,
  Book,
  Config,
} from "../../src/index.js";

const LOCAL_API_URL = "http://localhost:8081/_ah/api/bkper";
const FORBIDDEN_BOOK_ID =
  "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICA4Lzpsb4LDA";

export function getLocalApiUrl(): string {
  return LOCAL_API_URL;
}

export function getForbiddenBookId(): string {
  return FORBIDDEN_BOOK_ID;
}

export async function getOAuthToken(): Promise<string> {
  const token = await getBkperCliOAuthToken();
  if (!token) {
    throw new Error(
      "Failed to get OAuth token from bkper CLI. Run `bkper auth login` again."
    );
  }
  return token;
}

export async function createIntegrationConfig(
  overrides: Partial<Config> = {}
): Promise<Config> {
  const token = await getOAuthToken();
  return {
    apiBaseUrl: LOCAL_API_URL,
    oauthTokenProvider: async () => token,
    ...overrides,
  };
}

export async function isApiAvailable(): Promise<boolean> {
  try {
    const bkper = new Bkper(
      await createIntegrationConfig({
        requestRetryHandler: async () => {},
      })
    );
    await bkper.getBooks();
    return true;
  } catch {
    return false;
  }
}

export function uniqueTestName(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

export async function createReadyTestBook(name: string): Promise<Book> {
  const config = await createIntegrationConfig();
  const bkper = new Bkper(config);
  const book = await new Book(undefined, config).setName(name).create();

  const maxRetries = 10;
  const retryDelayMs = 500;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await bkper.getBook(book.getId());
    } catch {
      await delay(retryDelayMs);
    }
  }

  throw new Error(
    `Created test book ${book.getId()} but it did not become readable after ${maxRetries} retries`
  );
}

export async function seedBasicAccounts(book: Book): Promise<{
  cash: Account;
  revenue: Account;
  expenses: Account;
}> {
  const cash = await new Account(book)
    .setName("Cash")
    .setType(AccountType.ASSET)
    .create();

  const revenue = await new Account(book)
    .setName("Revenue")
    .setType(AccountType.INCOMING)
    .create();

  const expenses = await new Account(book)
    .setName("Expenses")
    .setType(AccountType.OUTGOING)
    .create();

  return { cash, revenue, expenses };
}

export async function deleteTestBook(book: Book | undefined): Promise<void> {
  if (!book) {
    return;
  }

  try {
    await book.remove();
  } catch (error) {
    console.warn(`Warning: Failed to delete test book ${book.getId()}:`, error);
  }
}

async function delay(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}
