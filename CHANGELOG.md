# Changelog

Notable user-facing changes to `bkper-js`, organized by released version.

## Unreleased

## [2.43.3](https://github.com/bkper/bkper-js/releases/tag/v2.43.3) - 2026-08-26

### Fixed

- Fixed `Account.isInGroup` to compare embedded group IDs correctly

## [2.43.2](https://github.com/bkper/bkper-js/releases/tag/v2.43.2) - 2026-08-18

### Changed

- Changed `Book.mergeTransactions(primary, secondary)` to forward supplied transaction fields as explicit merge overrides while keeping string inputs ID-only

## [2.43.0](https://github.com/bkper/bkper-js/releases/tag/v2.43.0) - 2026-08-14

### Added

- Added `Book.getTransactionsByIds` to retrieve complete transactions by ID in sequential batches of up to 200

## [2.42.0](https://github.com/bkper/bkper-js/releases/tag/v2.42.0) - 2026-07-22

### Added

- Added `Bkper.requestBookAccess`
- Added `Book.resolveAccessRequest`

## [2.41.1](https://github.com/bkper/bkper-js/releases/tag/v2.41.1) - 2026-07-14

### Added

- Added `EventType.FILE_DELETED`

## [2.41.0](https://github.com/bkper/bkper-js/releases/tag/v2.41.0) - 2026-07-14

### Added

- Added `File.remove`

## [2.40.2](https://github.com/bkper/bkper-js/releases/tag/v2.40.2) - 2026-07-14

### Added

- Added `User.getPlanCycle`

## [2.40.0](https://github.com/bkper/bkper-js/releases/tag/v2.40.0) - 2026-07-10

### Added

- Added `Book.listEvents(options)` overload
- Added `ListEventsOptions`
- Added event type filtering to `Book.listEvents`

### Deprecated

- Deprecated positional `Book.listEvents` parameters. Use `Book.listEvents(options)` instead

## [2.39.0](https://github.com/bkper/bkper-js/releases/tag/v2.39.0) - 2026-07-03

### Added

- Added `File.getCreatedAt`

## [2.38.0](https://github.com/bkper/bkper-js/releases/tag/v2.38.0) - 2026-07-01

### Added

- Added `Collaborator.getAvatarUrl`

## [2.37.0](https://github.com/bkper/bkper-js/releases/tag/v2.37.0) - 2026-06-16

### Added

- Added `Connection.update`
- Added `Integration.setName`
- Added `Integration.update`

## [2.36.0](https://github.com/bkper/bkper-js/releases/tag/v2.36.0) - 2026-06-09

### Added

- Added `Book.listFiles`
- Added `FileList`
- Added `FileList.getCursor`
- Added `FileList.getFirst`
- Added `FileList.size`
- Added `FileList.getItems`

## [2.35.2](https://github.com/bkper/bkper-js/releases/tag/v2.35.2) - 2026-05-26

### Changed

- Changed OAuth token provider configuration to be optional

## [2.35.1](https://github.com/bkper/bkper-js/releases/tag/v2.35.1) - 2026-05-20

### Changed

- Changed `Book.listEvents` to allow `null` `onError` for fetching all events

## [2.35.0](https://github.com/bkper/bkper-js/releases/tag/v2.35.0) - 2026-05-20

### Added

- Added `EventType.BOOK_AUDITED`
- Added `EventType.BOOK_CREATED`

## [2.34.2](https://github.com/bkper/bkper-js/releases/tag/v2.34.2) - 2026-05-15

### Added

- Added support for transaction ids in `Book.mergeTransactions`

## [2.34.0](https://github.com/bkper/bkper-js/releases/tag/v2.34.0) - 2026-05-06

### Added

- Added `MenuOpenMode`
- Added `App.getMenuOpenMode`
- Added `App.setMenuOpenMode`

### Deprecated

- Deprecated `App.getMenuPopupWidth`. Use `App.getMenuOpenMode` instead
- Deprecated `App.getMenuPopupHeight`. Use `App.getMenuOpenMode` instead

## [2.33.0](https://github.com/bkper/bkper-js/releases/tag/v2.33.0) - 2026-04-16

### Added

- Added `Book.mergeTransactions`

## [2.32.0](https://github.com/bkper/bkper-js/releases/tag/v2.32.0) - 2026-03-30

### Added

- Added `Book.getLogoUrl`

## [2.31.0](https://github.com/bkper/bkper-js/releases/tag/v2.31.0) - 2026-03-13

### Added

- Added `Book.batchUpdateAccounts`

## [2.30.0](https://github.com/bkper/bkper-js/releases/tag/v2.30.0) - 2026-03-10

### Added

- Added `Book.batchDeleteAccounts`

## [2.29.0](https://github.com/bkper/bkper-js/releases/tag/v2.29.0) - 2026-02-10

### Added

- Added `BooksDataTableBuilder`
- Added `AccountsDataTableBuilder`
- Added `GroupsDataTableBuilder`
- Added `TransactionsDataTableBuilder`
- Added `Book.createAccountsDataTable`
- Added `Book.createGroupsDataTable`
- Added `Book.createTransactionsDataTable`
- Added `TransactionsDataTableBuilder.ids`
- Added `TransactionsDataTableBuilder.properties`
- Added `TransactionsDataTableBuilder.urls`
- Added `TransactionsDataTableBuilder.recordedAt`
- Added `AccountsDataTableBuilder.hiddenProperties`
- Added `BooksDataTableBuilder.hiddenProperties`
- Added `GroupsDataTableBuilder.hiddenProperties`
- Added `GroupsDataTableBuilder.tree`
- Added `TransactionsDataTableBuilder.hiddenProperties`
- Added `BalancesDataTableBuilder.hiddenProperties`

## [2.28.0](https://github.com/bkper/bkper-js/releases/tag/v2.28.0) - 2026-02-03

### Added

- Added `User.getGivenName`

## [2.27.0](https://github.com/bkper/bkper-js/releases/tag/v2.27.0) - 2026-01-29

### Added

- Added `Billing.getCheckoutUrl`
- Added `Billing.getEmail`
- Added `Billing.getHostedDomain`

## [2.23.0](https://github.com/bkper/bkper-js/releases/tag/v2.23.0) - 2026-01-20

### Added

- Added `Billing.getCounts`
- Added `Billing.getPortalUrl`

### Removed

- Removed `Bkper.getBillingPortalUrl` from `Bkper`. Use `Billing.getPortalUrl` instead

## [2.22.0](https://github.com/bkper/bkper-js/releases/tag/v2.22.0) - 2026-01-19

### Added

- Added `Billing`
- Added `Billing.getAdminEmail`
- Added `Billing.getDaysLeftInTrial`
- Added `Billing.getPlan`
- Added `Billing.getTotalTransactionsThisMonth`
- Added `Billing.getTotalTransactionsThisYear`
- Added `Billing.hasStartedTrial`
- Added `Billing.isEnabled`
- Added `Billing.isPlanOverdue`
- Added `User.getBilling`

### Removed

- Removed `User.getDaysLeftInTrial` from `User`. Use `Billing.getDaysLeftInTrial` instead
- Removed `User.getPlan` from `User`. Use `Billing.getPlan` instead
- Removed `User.hasBillingEnabled` from `User`. Use `Billing.isEnabled` instead
- Removed `User.hasStartedTrial` from `User`. Use `Billing.hasStartedTrial` instead
- Removed `User.isFree` from `User`. Use `Billing.getPlan` instead

## [2.20.0](https://github.com/bkper/bkper-js/releases/tag/v2.20.0) - 2026-01-15

### Added

- Added `App.setUsers`
- Added `App.getUsers`
- Added `App.setDevelopers`
- Added `App.getDevelopers`
- Added `User.getUsername`

### Removed

- Removed `App.setUserEmails` from `App`. Use `App.setUsers` instead
- Removed `App.setDeveloperEmail` from `App`. Use `App.setDevelopers` instead

## [2.18.0](https://github.com/bkper/bkper-js/releases/tag/v2.18.0) - 2026-01-12

### Added

- Added `Config.agentIdProvider`

## [2.17.1](https://github.com/bkper/bkper-js/releases/tag/v2.17.1) - 2025-11-26

### Added

- Added `EventType.FILE_UPDATED`

## [2.17.0](https://github.com/bkper/bkper-js/releases/tag/v2.17.0) - 2025-11-26

### Added

- Added `File.update`

## [2.16.1](https://github.com/bkper/bkper-js/releases/tag/v2.16.1) - 2025-11-19

### Added

- Added `Bkper.getConfig`

## [2.16.0](https://github.com/bkper/bkper-js/releases/tag/v2.16.0) - 2025-11-19

### Added

- Added `ResourceProperty.setVisibleProperty`
- Added `ResourceProperty.setVisibleProperties`
- Added `ResourceProperty.getVisibleProperties`

## [2.15.0](https://github.com/bkper/bkper-js/releases/tag/v2.15.0) - 2025-10-10

### Added

- Added `Book.remove`

## [2.14.0](https://github.com/bkper/bkper-js/releases/tag/v2.14.0) - 2025-10-09

### Added

- Added `Book.countTransactions`

## [2.13.0](https://github.com/bkper/bkper-js/releases/tag/v2.13.0) - 2025-10-06

### Added

- Added `Transaction.removeFile`

### Changed

- Files attached to transactions are now created internally when transaction is persisted

## [2.12.1](https://github.com/bkper/bkper-js/releases/tag/v2.12.1) - 2025-09-24

### Added

- Added `Transaction.getCreatedBy`

## [2.12.0](https://github.com/bkper/bkper-js/releases/tag/v2.12.0) - 2025-09-23

### Added

- Added `Book.getBacklog`
- Added `Backlog`
- Added `Backlog.getCount`

## [2.11.0](https://github.com/bkper/bkper-js/releases/tag/v2.11.0) - 2025-09-22

### Added

- Added `Integration.getLogoUrl`
- Added `Integration.getLogoUrlDark`

### Deprecated

- Deprecated `Integration.getLogo`

## [2.9.0](https://github.com/bkper/bkper-js/releases/tag/v2.9.0) - 2025-09-08

### Added

- Added `Account.isBalanceVerified`
- Added `Group.isBalanceVerified`

## [2.8.0](https://github.com/bkper/bkper-js/releases/tag/v2.8.0) - 2025-09-05

### Added

- Added `App.getOwnerWebsiteUrl`
- Added `App.getReadme`
- Added `App.getRepositoryUrl`
- Added `App.getWebsiteUrl`
- Added `App.isInstallable`
- Added `App.isRepositoryPrivate`

## [2.7.1](https://github.com/bkper/bkper-js/releases/tag/v2.7.1) - 2025-09-03

### Changed

- Replaced axios with native Fetch API for better compatibility with multiple environments

## [2.7.0](https://github.com/bkper/bkper-js/releases/tag/v2.7.0) - 2025-09-02

### Added

- Added `Book.getCollaborators`
- Added `Collaborator`
- Added `Collaborator.json`
- Added `Collaborator.getId`
- Added `Collaborator.getEmail`
- Added `Collaborator.getPermission`
- Added `Collaborator.setEmail`
- Added `Collaborator.setPermission`
- Added `Collaborator.create`
- Added `Collaborator.update`
- Added `Collaborator.remove`

## [2.6.0](https://github.com/bkper/bkper-js/releases/tag/v2.6.0) - 2025-08-25

### Added

- Added `File.getProperties`
- Added `File.setProperties`
- Added `File.getProperty`
- Added `File.setProperty`
- Added `File.deleteProperty`

## [2.4.0](https://github.com/bkper/bkper-js/releases/tag/v2.4.0) - 2025-07-04

### Added

- Added `includeGroups` parameter to `Bkper.getBook()` method for selective group loading

## [2.2.0](https://github.com/bkper/bkper-js/releases/tag/v2.2.0) - 2025-07-01

### Added

- Added `Balance` class back for improved balance reporting
- Added `BalancesDataTableBuilder` for building balance data tables
- Added `BalanceType` enum with TOTAL, PERIOD, and CUMULATIVE options

## [2.0.0](https://github.com/bkper/bkper-js/releases/tag/v2.0.0) - 2025-06-30

### Breaking Changes

- **BREAKING CHANGE:** Refactored `Bkper` class from static methods to constructor-based pattern
- **BREAKING CHANGE:** Removed deprecated methods: `Transaction.remove()`, `Transaction.restore()`, `Account.getBalance()`, `Account.getBalanceRaw()`

### Migration

- **MIGRATION:** Use `transaction.trash()` and `transaction.untrash()` instead of `remove()` and `restore()`
- **MIGRATION:** Use `Book.getBalancesReport()` instead of `Account.getBalance()` methods

## [1.47.2](https://github.com/bkper/bkper-js/releases/tag/v1.47.2) - 2025-06-27

### Added

- Added `Book.copy`

## [1.47.0](https://github.com/bkper/bkper-js/releases/tag/v1.47.0) - 2025-06-20

### Added

- Added `Transaction.getUpdatedAt`
- Added `Transaction.getUpdatedAtFormatted`

## [1.45.0](https://github.com/bkper/bkper-js/releases/tag/v1.45.0) - 2025-05-20

### Added

- Added `Book.batchPostTransactions`

## [1.44.0](https://github.com/bkper/bkper-js/releases/tag/v1.44.0) - 2025-05-19

### Added

- Added `Book.batchUntrashTransactions`

## [1.43.0](https://github.com/bkper/bkper-js/releases/tag/v1.43.0) - 2025-05-14

### Added

- Added `Book.batchUpdateTransactions`

## [1.42.0](https://github.com/bkper/bkper-js/releases/tag/v1.42.0) - 2025-05-09

### Added

- Added `Book.batchCheckTransactions`
- Added `Book.batchUncheckTransactions`

## [1.41.0](https://github.com/bkper/bkper-js/releases/tag/v1.41.0) - 2025-05-05

### Added

- Added `Query.setTitle`
- Added `Query.setQuery`

## [1.40.0](https://github.com/bkper/bkper-js/releases/tag/v1.40.0) - 2025-05-05

### Added

- Added `Query.create`
- Added `Query.update`

## [1.39.0](https://github.com/bkper/bkper-js/releases/tag/v1.39.0) - 2025-05-01

### Added

- Added `Query.remove`

## [1.38.0](https://github.com/bkper/bkper-js/releases/tag/v1.38.0) - 2025-04-29

### Added

- Added `Query`
- Added `Query.json`
- Added `Query.getId`
- Added `Query.getTitle`
- Added `Query.getQuery`
- Added `Book.getSavedQueries`

## [1.37.0](https://github.com/bkper/bkper-js/releases/tag/v1.37.0) - 2025-04-29

### Added

- Added `Group.isLocked`
- Added `Group.setLocked`

## [1.35.0](https://github.com/bkper/bkper-js/releases/tag/v1.35.0) - 2025-03-28

### Added

- Added `Book.batchCreateAccounts`
- Added `Book.batchCreateGroups`

## [1.34.7](https://github.com/bkper/bkper-js/releases/tag/v1.34.7) - 2025-03-18

### Added

- Added `App.getFilePatterns`
- Added `App.getOwnerLogoUrl`
- Added `App.getOwnerName`
- Added `App.isPublished`

## [1.34.6](https://github.com/bkper/bkper-js/releases/tag/v1.34.6) - 2025-03-17

### Added

- Added `Agent.getLogoUrlDark`

## [1.34.5](https://github.com/bkper/bkper-js/releases/tag/v1.34.5) - 2025-03-17

### Added

- Added `Transaction.getAgentName`
- Added `Transaction.getAgentLogoUrl`
- Added `Transaction.getAgentLogoUrlDark`

## [1.30.0](https://github.com/bkper/bkper-js/releases/tag/v1.30.0) - 2025-03-10

### Added

- Added `App.getLogoUrlDark`

## [1.29.0](https://github.com/bkper/bkper-js/releases/tag/v1.29.0) - 2025-02-26

### Added

- Added `BotResponse.getEvent`

## [1.28.0](https://github.com/bkper/bkper-js/releases/tag/v1.28.0) - 2025-02-26

### Added

- Added `Book.batchReplayEvents`
- Added `BotResponse.remove`
- Added `BotResponse.replay`
- Added `Event.getBook`

## [1.27.0](https://github.com/bkper/bkper-js/releases/tag/v1.27.0) - 2025-02-21

### Added

- Added `App.getEvents`
- Added `App.hasEvents`

## [1.26.0](https://github.com/bkper/bkper-js/releases/tag/v1.26.0) - 2025-02-20

### Added

- Added `Event.hasErrorResponse`

## [1.25.0](https://github.com/bkper/bkper-js/releases/tag/v1.25.0) - 2025-02-19

### Added

- Added `BotResponseType` enum
- Added `BotResponse`
- Added `BotResponse.getAgentId`
- Added `BotResponse.getCreatedAt`
- Added `BotResponse.getMessage`
- Added `BotResponse.getType`
- Added `Event.getBotResponses`

## [1.23.0](https://github.com/bkper/bkper-js/releases/tag/v1.23.0) - 2025-02-10

### Added

- Added `App.getDescription`
- Added `App.getLogoUrl`
- Added `App.getName`
- Added `Book.getApps`

## [1.22.0](https://github.com/bkper/bkper-js/releases/tag/v1.22.0) - 2025-02-07

### Added

- Added `EventType` enum
- Added `Agent`
- Added `Agent.getId`
- Added `Agent.getLogoUrl`
- Added `Agent.getName`
- Added `Agent.json`
- Added `Event.getAgent`
- Added `Event.getCreatedAt`
- Added `Event.getId`
- Added `Event.getType`
- Added `Event.getUser`
- Added `User.getAvatarUrl`

## [1.21.0](https://github.com/bkper/bkper-js/releases/tag/v1.21.0) - 2025-01-30

### Added

- Added `Book.getAutoPost`
- Added `Book.setAutoPost`
- Added `User.getPlan`

## [1.20.0](https://github.com/bkper/bkper-js/releases/tag/v1.20.0) - 2025-01-28

### Added

- Added `User.hasBillingEnabled`

## [1.19.0](https://github.com/bkper/bkper-js/releases/tag/v1.19.0) - 2025-01-06

### Added

- Added `BalancesContainer`
- Added `BalancesContainer.getName`
- Added `BalancesContainer.getNormalizedName`
- Added `BalancesContainer.getGroup`
- Added `BalancesContainer.getAccount`
- Added `BalancesContainer.getParent`
- Added `BalancesContainer.getDepth`
- Added `BalancesContainer.isCredit`
- Added `BalancesContainer.isPermanent`
- Added `BalancesContainer.isFromAccount`
- Added `BalancesContainer.isFromGroup`
- Added `BalancesContainer.hasGroupBalances`
- Added `BalancesContainer.getCumulativeBalance`
- Added `BalancesContainer.getCumulativeBalanceRaw`
- Added `BalancesContainer.getCumulativeBalanceText`
- Added `BalancesContainer.getCumulativeBalanceRawText`
- Added `BalancesContainer.getPeriodBalance`
- Added `BalancesContainer.getPeriodBalanceRaw`
- Added `BalancesContainer.getPeriodBalanceText`
- Added `BalancesContainer.getPeriodBalanceRawText`
- Added `BalancesContainer.getBalancesContainers`
- Added `BalancesContainer.getBalancesContainer`
- Added `BalancesReport`
- Added `BalancesReport.getBook`
- Added `BalancesReport.getPeriod`
- Added `BalancesReport.getBalancesContainers`
- Added `BalancesReport.getBalancesContainer`
- Added `Group.isCredit`
- Added `Group.isMixed`

## [1.18.0](https://github.com/bkper/bkper-js/releases/tag/v1.18.0) - 2024-12-20

### Added

- Added `Book.listEvents`
- Added `EventList`
- Added `EventList.getCursor`
- Added `EventList.getFirst`
- Added `EventList.getItems`
- Added `EventList.size`

## [1.17.0](https://github.com/bkper/bkper-js/releases/tag/v1.17.0) - 2024-12-18

### Added

- Added `Group.isPermanent`
- Added `Group.hasParent`
- Added `Group.getChildren`
- Added `Group.getDescendants`
- Added `Group.getDescendantTreeIds`
- Added `Group.hasChildren`
- Added `Group.isLeaf`
- Added `Group.isRoot`
- Added `Group.getDepth`
- Added `Group.getRoot`
- Added `Group.getRootName`
- Added `Group.hasAccounts`

## [1.16.0](https://github.com/bkper/bkper-js/releases/tag/v1.16.0) - 2024-11-28

### Added

- Added `Transaction.isLocked`

## [1.15.0](https://github.com/bkper/bkper-js/releases/tag/v1.15.0) - 2024-11-26

### Added

- Added `Transaction.getAmountFormatted`

## [1.14.0](https://github.com/bkper/bkper-js/releases/tag/v1.14.0) - 2024-11-05

### Added

- Added `Transaction.trash`
- Added `Transaction.untrash`

### Removed

- Removed `Transaction.remove` from `Transaction`
- Removed `Transaction.restore` from `Transaction`

## [1.12.0](https://github.com/bkper/bkper-js/releases/tag/v1.12.0) - 2024-10-11

### Added

- Added `Collection.addBooks`
- Added `Collection.remove`
- Added `Collection.removeBooks`

## [1.11.0](https://github.com/bkper/bkper-js/releases/tag/v1.11.0) - 2024-10-11

### Added

- Added `Collection.create`
- Added `Collection.getOwnerUsername`
- Added `Collection.getPermission`
- Added `Collection.getUpdatedAt`
- Added `Collection.setName`
- Added `Collection.update`

## [1.10.0](https://github.com/bkper/bkper-js/releases/tag/v1.10.0) - 2024-10-09

### Added

- Added `Bkper.getBillingPortalUrl`
- Added `Integration.getAddedBy`
- Added `Integration.getAgentId`
- Added `Integration.getDateAddedMs`
- Added `Integration.getLastUpdateMs`
- Added `Integration.getLogo`
- Added `Integration.remove`

## [1.9.3](https://github.com/bkper/bkper-js/releases/tag/v1.9.3) - 2024-10-09

### Added

- Added `Connection.getDateAddedMs`
- Added `Connection.getLogo`
- Added `Connection.remove`

## [1.9.1](https://github.com/bkper/bkper-js/releases/tag/v1.9.1) - 2024-10-08

### Added

- Added `TransactionList` returned from `Book.listTransactions`

## [1.9.0](https://github.com/bkper/bkper-js/releases/tag/v1.9.0) - 2024-10-08

### Removed

- Removed `newTransaction` from `Book`. Use `Transaction` constructor instead
- Removed `newAccount` from `Book`. Use `Account` constructor instead
- Removed `newGroup` from `Book`. Use `Group` constructor instead
- Removed `newFile` from `Book`. Use `File` constructor instead

## [1.8.2](https://github.com/bkper/bkper-js/releases/tag/v1.8.2) - 2024-10-04

### Changed

- Exposed `payload` property on all objects from `bkper-js` interface

## [1.8.0](https://github.com/bkper/bkper-js/releases/tag/v1.8.0) - 2024-10-01

### Removed

- Removed `TransactionIterator` from `Transaction`

## [1.7.0](https://github.com/bkper/bkper-js/releases/tag/v1.7.0) - 2024-09-30

### Added

- Added `Bkper.getTemplates`
- Added `Template`
- Added `Template.getBookId`
- Added `Template.getBookLink`
- Added `Template.getCategory`
- Added `Template.getDescription`
- Added `Template.getImageUrl`
- Added `Template.getName`
- Added `Template.getSheetsLink`
- Added `Template.getTimesUsed`
- Added `Template.json`

## [1.6.0](https://github.com/bkper/bkper-js/releases/tag/v1.6.0) - 2024-09-30

### Added

- Added `App.json`
- Added `Bkper.getApps`

## [1.5.0](https://github.com/bkper/bkper-js/releases/tag/v1.5.0) - 2024-09-23

### Added

- Added `Bkper.newBook`
- Added `Book.create`

## [1.4.0](https://github.com/bkper/bkper-js/releases/tag/v1.4.0) - 2024-09-20

### Added

- Added `User.getEmail`
- Added `User.getHostedDomain`
- Added `User.isFree`
- Added `User.hasStartedTrial`
- Added `User.getDaysLeftInTrial`
- Added `User.hasUsedConnections`
- Added `User.json`

## [1.3.0](https://github.com/bkper/bkper-js/releases/tag/v1.3.0) - 2024-09-20

### Added

- Added `Visibility` enum
- Added `Bkper.getBooks`
- Added `Book.getTotalTransactions`
- Added `Book.getTotalTransactionsCurrentMonth`
- Added `Book.getTotalTransactionsCurrentYear`
- Added `Book.getVisibility`
- Added `Collection.json`

## [1.2.0](https://github.com/bkper/bkper-js/releases/tag/v1.2.0) - 2024-09-05

### Added

- Added `Config.requestRetryHandler`

## [1.0.0](https://www.npmjs.com/package/bkper-js/v/1.0.0) - 2024-08-29

### Added

- Extracted `bkper-js` from `bkper` as a standalone library.

## Legacy history (pre-v1.0.0)

These entries predate the standalone `bkper-js` repository and cannot be mapped reliably to local version tags.

### January 2024

#### Added

- Added `Transaction.setChecked`

### June 2023

#### Added

- Added `Bkper.getUser`
- Added `Bkper.setConfig`
- Added `Book.batchTrashTransactions`
- Added `Book.createIntegration`
- Added `Book.getIntegrations`
- Added `Book.updateIntegration`
- Added `Config` interface
- Added `Connection`
- Added `Connection.clearTokenProperties`
- Added `Connection.create`
- Added `Connection.deleteProperty`
- Added `Connection.getAgentId`
- Added `Connection.getEmail`
- Added `Connection.getId`
- Added `Connection.getIntegrations`
- Added `Connection.getName`
- Added `Connection.getProperties`
- Added `Connection.getProperty`
- Added `Connection.getPropertyKeys`
- Added `Connection.getType`
- Added `Connection.getUUID`
- Added `Connection.json`
- Added `Connection.setAgentId`
- Added `Connection.setName`
- Added `Connection.setProperties`
- Added `Connection.setProperty`
- Added `Connection.setType`
- Added `Connection.setUUID`
- Added `Integration`
- Added `Integration.deleteProperty`
- Added `Integration.getBookId`
- Added `Integration.getId`
- Added `Integration.getName`
- Added `Integration.getProperties`
- Added `Integration.getProperty`
- Added `Integration.json`
- Added `Integration.setProperties`
- Added `Integration.setProperty`
- Added `User`
- Added `User.getConnection`
- Added `User.getConnections`
- Added `User.getFullName`
- Added `User.getId`
- Added `User.getName`

#### Deprecated

- Deprecated `Bkper.setApiKey`
- Deprecated `Bkper.setOAuthTokenProvider`

### September 2022

#### Deprecated

- Deprecated `Account.getBalance`

### May 2022

#### Added

- Added `Book.parseDate`

### April 2022

#### Added

- Added `Book.getClosingDate`
- Added `Book.setClosingDate`

### October 2021

#### Added

- Added `Book.getGroupsByAccount`

### May 2021

#### Added

- Added `Group.getParent`
- Added `Group.setParent`

#### Removed

- **BREAKING CHANGE:** Removed `AccountsDataTableBuilder`
- **BREAKING CHANGE:** Removed `BalancesDataTableBuilder`
- **BREAKING CHANGE:** Removed `TransactionsDataTableBuilder`
- **BREAKING CHANGE:** Removed `BalancesReport`
- **BREAKING CHANGE:** Removed `Balance`
- **BREAKING CHANGE:** Removed `BalancesContainer`

### April 2021

#### Added

- Added `Book.getLockDate`
- Added `Book.setLockDate`

### March 2021

#### Removed

- **BREAKING CHANGE:** Removed `BalanceCheckedType`

### February 2021

#### Added

- Added `Book.getPeriod`
- Added `Book.setPeriod`
- Added `Book.getPeriodStartMonth`
- Added `Book.setPeriodStartMonth`
- Added `Book.getPageSize`
- Added `Book.setPageSize`

### January 2021

#### Added

- `bkper` client library published
