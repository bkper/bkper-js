import { expect } from "chai";
import { resolveBaseUrl, PROXY_BASE_URL, DIRECT_BASE_URL } from '../src/service/http-api-request.js';
import { Config } from '../src/model/Config.js';

describe('http-api-request', () => {

  describe('#resolveBaseUrl()', () => {

    it('should use custom apiBaseUrl when provided', () => {
      const config: Config = {
        apiBaseUrl: 'https://custom.example.com/api',
        apiKeyProvider: async () => 'my-api-key'
      };
      expect(resolveBaseUrl(config)).to.equal('https://custom.example.com/api');
    });

    it('should use custom apiBaseUrl even without apiKeyProvider', () => {
      const config: Config = {
        apiBaseUrl: 'https://localhost:8081/_ah/api/bkper'
      };
      expect(resolveBaseUrl(config)).to.equal('https://localhost:8081/_ah/api/bkper');
    });

    it('should use direct URL when apiKeyProvider is set', () => {
      const config: Config = {
        apiKeyProvider: async () => 'my-api-key'
      };
      expect(resolveBaseUrl(config)).to.equal(DIRECT_BASE_URL);
    });

    it('should use proxy URL when no apiKeyProvider and no apiBaseUrl', () => {
      const config: Config = {};
      expect(resolveBaseUrl(config)).to.equal(PROXY_BASE_URL);
    });

    it('should use proxy URL when apiKeyProvider is undefined', () => {
      const config: Config = {
        apiKeyProvider: undefined
      };
      expect(resolveBaseUrl(config)).to.equal(PROXY_BASE_URL);
    });

    it('should use direct URL with oauthTokenProvider only when apiKeyProvider is set', () => {
      const config: Config = {
        apiKeyProvider: async () => 'my-api-key',
        oauthTokenProvider: async () => 'oauth-token'
      };
      expect(resolveBaseUrl(config)).to.equal(DIRECT_BASE_URL);
    });

    it('should use proxy URL with oauthTokenProvider only when no apiKeyProvider', () => {
      const config: Config = {
        oauthTokenProvider: async () => 'oauth-token'
      };
      expect(resolveBaseUrl(config)).to.equal(PROXY_BASE_URL);
    });

  });

});
