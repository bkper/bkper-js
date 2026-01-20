import { expect } from "chai";
import { resolveBaseUrl, API_BASE_URL } from '../src/service/http-api-request.js';
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

    it('should use API_BASE_URL when apiKeyProvider is set without custom apiBaseUrl', () => {
      const config: Config = {
        apiKeyProvider: async () => 'my-api-key'
      };
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

    it('should use API_BASE_URL when no apiKeyProvider and no apiBaseUrl', () => {
      const config: Config = {};
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

    it('should use API_BASE_URL when apiKeyProvider is undefined', () => {
      const config: Config = {
        apiKeyProvider: undefined
      };
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

    it('should use API_BASE_URL with oauthTokenProvider when no custom apiBaseUrl', () => {
      const config: Config = {
        apiKeyProvider: async () => 'my-api-key',
        oauthTokenProvider: async () => 'oauth-token'
      };
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

    it('should use API_BASE_URL with oauthTokenProvider only when no apiKeyProvider', () => {
      const config: Config = {
        oauthTokenProvider: async () => 'oauth-token'
      };
      expect(resolveBaseUrl(config)).to.equal(API_BASE_URL);
    });

  });

});
