# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build Commands
- `bun run build` - Full build pipeline (clean, compile, test, API extraction, cleanup)
- `bun run build:compile` - TypeScript compilation only
- `bun run dev` - Watch mode compilation with TypeScript
- `bun run clean` - Clean lib and node_modules directories

### Testing
- `bun run test` - Run all tests using Mocha with ts-node
- Tests are located in `test/` directory and use Chai assertions
- Single test file: `env TS_NODE_COMPILER_OPTIONS='{"rootDir": "." }' mocha -r ts-node/register 'test/specific-file.spec.ts'`

### Package Management
- `bun run upgrade:api` - Update @bkper/bkper-api-types to latest version
- Uses Bun as primary package manager (bun.lockb present)

### Versioning and Publishing
- `bun run patch/minor/major` - Version bump commands
- `bun run preversion` - Runs full build before version bump
- `bun run postversion` - Automated git push, npm publish, and git push tags

## Code Architecture

### Project Structure
- **Source**: `src/` - TypeScript source files
- **Compiled**: `lib/` - JavaScript output with type definitions
- **Tests**: `test/` - Test files using Mocha + Chai
- **API Documentation**: `etc/` and `temp/` - API Extractor output

### Core Architecture
This is a TypeScript client library for the Bkper REST API with the following key components:

#### Main Entry Point
- `src/index.ts` - Exports all public classes and enums
- `Bkper` class (`src/model/Bkper.ts`) - Main constructor-based entry point with config and resource access methods

#### Model Layer (`src/model/`)
Core business entities representing Bkper resources:
- `Book` - Main accounting book entity
- `Account`, `Transaction`, `Group` - Core accounting entities  
- `App`, `User`, `Collection` - Platform management entities
- `Query`, `BalancesReport` - Data querying and reporting
- `Event`, `EventList`, `BotResponse` - Event handling and bot integration
- `Enums.ts` - All enumeration types (Periodicity, DecimalSeparator, etc.)

#### Service Layer (`src/service/`)
HTTP API communication layer:
- `http-api-request.ts` - Base HTTP client with authentication and error handling
- `*-service.ts` files - Service classes for each resource type (book-service, account-service, etc.)
- Uses axios for HTTP requests with OAuth2 Bearer token authentication

#### Utilities
- `src/utils.ts` - Date parsing, value parsing, text normalization, URL building utilities
- Handles multiple date formats, decimal separators, and locale-specific formatting

### Authentication & Configuration
- Uses `Config` object passed to `new Bkper(config)` constructor with API key and OAuth token providers
- Supports both API key and OAuth2 authentication
- Default API base URL: `https://app.bkper.com/_ah/api/bkper`

### Build System
- TypeScript compilation with Google TypeScript Style (gts)
- API Extractor for generating consolidated .d.ts files and API documentation
- Outputs ES modules (type: "module" in package.json)
- Target: ES2015 with strict mode enabled

### Dependencies
- **Runtime**: axios (HTTP), big.js (decimals), dayjs/luxon (dates), @google-cloud/local-auth
- **Peer**: @bkper/bkper-api-types (API type definitions)
- **Dev**: TypeScript, Mocha, Chai, API Extractor, gts

### Key Patterns
- All model classes follow a consistent pattern with service layer delegation
- Async/await throughout with Promise-based APIs
- Constructor-based instantiation of main Bkper class for resource access
- Fluent/chainable API design for method chaining
- Comprehensive error handling with structured HTTP error responses

## Generated Files
- `@etc/bkper-js.api.md` is a generated code, then NEVER change it