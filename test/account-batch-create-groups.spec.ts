import { expect } from 'chai';
import { Account } from '../src/model/Account.js';
import { Book } from '../src/model/Book.js';
import { Config } from '../src/model/Config.js';

interface CapturedRequest {
    url: string;
    body: string;
}

function createJsonResponse(data: unknown): Response {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'content-type': 'application/json',
        },
    });
}

describe('Book.batchCreateAccounts()', () => {
    let originalFetch: typeof globalThis.fetch;

    beforeEach(() => {
        originalFetch = globalThis.fetch;
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    it('should resolve group names before posting batch accounts', async () => {
        const requests: CapturedRequest[] = [];
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            requests.push({
                url,
                body: typeof init?.body === 'string' ? init.body : '',
            });

            if (url === 'https://api.example.com/v5/books/book-1/groups/Current%20Assets?') {
                return createJsonResponse({id: 'grp-1', name: 'Current Assets', permanent: true});
            }

            return createJsonResponse({
                items: [
                    {
                        id: 'acc-1',
                        name: 'Cash',
                        type: 'ASSET',
                        groups: [{id: 'grp-1', name: 'Current Assets'}],
                    },
                ],
            });
        };

        const config: Config = {
            apiBaseUrl: 'https://api.example.com',
            oauthTokenProvider: async () => 'test-token',
        };
        const book = new Book(
            {
                id: 'book-1',
                groups: [{id: 'grp-1', name: 'Current Assets', permanent: true}],
            },
            config
        );

        const account = new Account(book, {
            name: 'Cash',
            type: 'ASSET',
            groups: [{name: 'Current Assets'}],
        });

        await book.batchCreateAccounts([account]);

        const batchRequest = requests.find(request =>
            request.url === 'https://api.example.com/v5/books/book-1/accounts/batch?'
        );
        expect(batchRequest).to.not.be.undefined;

        const payload = JSON.parse(batchRequest!.body) as bkper.AccountList;
        const items = payload.items || [];
        expect(items).to.have.length(1);
        expect(items[0].groups).to.have.length(1);
        expect(items[0].groups?.[0].id).to.equal('grp-1');
        expect(items[0].groups?.[0].name).to.equal('Current Assets');
    });

    it('should throw a clear error when a group name cannot be resolved', async () => {
        let fetchCalled = false;
        globalThis.fetch = async (): Promise<Response> => {
            fetchCalled = true;
            return createJsonResponse({items: []});
        };

        const config: Config = {
            apiBaseUrl: 'https://api.example.com',
            oauthTokenProvider: async () => 'test-token',
        };
        const book = new Book({id: 'book-1'}, config);
        book.getGroup = async () => undefined;

        const account = new Account(book, {
            name: 'Cash',
            type: 'ASSET',
            groups: [{name: 'Missing Group'}],
        });

        try {
            await book.batchCreateAccounts([account]);
            expect.fail('Expected batchCreateAccounts to throw');
        } catch (err) {
            expect((err as Error).message).to.equal('Group not found: Missing Group');
        }

        expect(fetchCalled).to.be.false;
    });
});
