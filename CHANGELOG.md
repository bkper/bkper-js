### **Changelog**

See what's new and what has changed in bkper-js

2025
----

**September 2025**
* **v2.8.0 - INTERNAL REFACTOR:**
    * Introduced abstract `Resource` class for all model entities
    * Improved config management with `getConfig()` pattern for config resolution
    * Enhanced type safety with explicit Config type usage throughout
    * Standardized `json()` method across resources for consistent JSON serialization
    * Maintained full backward compatibility - no breaking changes to existing APIs
* Added `App.getOwnerWebsiteUrl`
* Added `App.getReadme`
* Added `App.getRepositoryUrl`
* Added `App.getWebsiteUrl`
* Added `App.isInstallable`
* Added `App.isRepositoryPrivate`
* Added `Collaborator`
* Added `Collaborator.json`
* Added `Collaborator.getId`
* Added `Collaborator.getEmail`
* Added `Collaborator.getPermission`
* Added `Collaborator.setEmail`
* Added `Collaborator.setPermission`
* Added `Collaborator.create`
* Added `Collaborator.update`
* Added `Collaborator.remove`
* Added `Book.getCollaborators`
* Replaced axios with native Fetch API for better compatibility with multiple environments

**August 2025**

* Added `Transaction.setFiles`
* Added `File.getProperties`
* Added `File.setProperties`
* Added `File.getProperty`
* Added `File.setProperty`
* Added `File.deleteProperty`

**July 2025**

* **BREAKING CHANGE:** Refactored `Bkper` class from static methods to constructor-based pattern
* **BREAKING CHANGE:** Removed deprecated methods: `Transaction.remove()`, `Transaction.restore()`, `Account.getBalance()`, `Account.getBalanceRaw()`
* **MIGRATION:** Use `transaction.trash()` and `transaction.untrash()` instead of `remove()` and `restore()`
* **MIGRATION:** Use `Book.getBalancesReport()` instead of `Account.getBalance()` methods
* Added `Balance` class back for improved balance reporting
* Added `BalancesDataTableBuilder` for building balance data tables
* Added `BalanceType` enum with TOTAL, PERIOD, and CUMULATIVE options
* Added `includeGroups` parameter to `Bkper.getBook()` method for selective group loading


**June 2025**   
* Added `Book.copy`
* Added `Transaction.getUpdatedAt`
* Added `Transaction.getUpdatedAtFormatted`

**May 2025**
* Added `Group.isLocked`
* Added `Group.setLocked`
* Added `Message.stream`
* Added `Query`
* Added `Query.json`
* Added `Query.getId`
* Added `Query.getTitle`
* Added `Query.setTitle`
* Added `Query.getQuery`
* Added `Query.setQuery`
* Added `Query.create`
* Added `Query.update`
* Added `Query.remove`
* Added `Book.getSavedQueries`
* Added `Book.batchPostTransactions`
* Added `Book.batchCheckTransactions`
* Added `Book.batchUncheckTransactions`
* Added `Book.batchUpdateTransactions`
* Added `Book.batchUntrashTransactions`

**April 2025**
* Added `Book.batchCreateAccounts`
* Added `Book.batchCreateGroups`

**March 2025**
* Added `Agent.getLogoUrlDark`
* Added `App.getFilePatterns`
* Added `App.getLogoUrlDark`
* Added `App.getOwnerLogoUrl`
* Added `App.getOwnerName`
* Added `App.isConversational`
* Added `App.isPublished`
* Added `App.setConversationUrlDev`
* Added `Bkper.getConversations`
* Added `Conversation`
* Added `Conversation.create`
* Added `Conversation.getAgent`
* Added `Conversation.getCreatedAt`
* Added `Conversation.getId`
* Added `Conversation.getMessages`
* Added `Conversation.getTitle`
* Added `Conversation.getUpdatedAt`
* Added `Conversation.json`
* Added `Message`
* Added `Message.create`
* Added `Message.deleteProperty`
* Added `Message.getAgent`
* Added `Message.getCreatedAt`
* Added `Message.getContent`
* Added `Message.getConversation`
* Added `Message.getId`
* Added `Message.getProperties`
* Added `Message.getProperty`
* Added `Message.getUser`
* Added `Message.setContent`
* Added `Message.setProperties`
* Added `Message.setProperty`
* Added `Message.json`
* Added `Transaction.getAgentName`
* Added `Transaction.getAgentLogoUrl`
* Added `Transaction.getAgentLogoUrlDark`

**February 2025**
* Added `EventType` enum
* Added `BotResponseType` enum
* Added `Agent`
* Added `Agent.getId`
* Added `Agent.getLogoUrl`
* Added `Agent.getName`
* Added `Agent.json`
* Added `App.getDescription`
* Added `App.getEvents`
* Added `App.getLogoUrl`
* Added `App.getName`
* Added `App.hasEvents`
* Added `Book.batchReplayEvents`
* Added `Book.getApps`
* Added `BotResponse`
* Added `BotResponse.getAgentId`
* Added `BotResponse.getCreatedAt`
* Added `BotResponse.getEvent`
* Added `BotResponse.getMessage`
* Added `BotResponse.getType`
* Added `BotResponse.remove`
* Added `BotResponse.replay`
* Added `Event.getAgent`
* Added `Event.getBook`
* Added `Event.getBotResponses`
* Added `Event.getCreatedAt`
* Added `Event.getId`
* Added `Event.getType`
* Added `Event.getUser`
* Added `Event.hasErrorResponse`
* Added `User.getAvatarUrl`

**January 2025**
* Added `BalancesContainer`
* Added `BalancesContainer.getName`
* Added `BalancesContainer.getNormalizedName`
* Added `BalancesContainer.getGroup`
* Added `BalancesContainer.getAccount`
* Added `BalancesContainer.getParent`
* Added `BalancesContainer.getDepth`
* Added `BalancesContainer.isCredit`
* Added `BalancesContainer.isPermanent`
* Added `BalancesContainer.isFromAccount`
* Added `BalancesContainer.isFromGroup`
* Added `BalancesContainer.hasGroupBalances`
* Added `BalancesContainer.getCumulativeBalance`
* Added `BalancesContainer.getCumulativeBalanceRaw`
* Added `BalancesContainer.getCumulativeBalanceText`
* Added `BalancesContainer.getCumulativeBalanceRawText`
* Added `BalancesContainer.getPeriodBalance`
* Added `BalancesContainer.getPeriodBalanceRaw`
* Added `BalancesContainer.getPeriodBalanceText`
* Added `BalancesContainer.getPeriodBalanceRawText`
* Added `BalancesContainer.getBalancesContainers`
* Added `BalancesContainer.getBalancesContainer`
* Added `BalancesReport`
* Added `BalancesReport.getBook`
* Added `BalancesReport.getPeriod`
* Added `BalancesReport.getBalancesContainers`
* Added `BalancesReport.getBalancesContainer`
* Added `Book.getAutoPost`
* Added `Book.setAutoPost`
* Added `Group.isCredit`
* Added `Group.isMixed`
* Added `User.getPlan`
* Added `User.hasBillingEnabled`


2024
----

**December 2024**
* Added `Book.listEvents`
* Added `EventList`
* Added `EventList.getCursor`
* Added `EventList.getFirst`
* Added `EventList.getItems`
* Added `EventList.size`
* Added `Group.isPermanent`
* Added `Group.hasParent`
* Added `Group.getChildren`
* Added `Group.getDescendants`
* Added `Group.getDescendantTreeIds`
* Added `Group.hasChildren`
* Added `Group.isLeaf`
* Added `Group.isRoot`
* Added `Group.getDepth`
* Added `Group.getRoot`
* Added `Group.getRootName`
* Added `Group.hasAccounts`

**November 2024**
* Added `Transaction.trash`
* Added `Transaction.untrash`
* Added `Transaction.getAmountFormatted`
* Added `Transaction.isLocked`
* Removed ```Transaction.remove``` from `Transaction`
* Removed ```Transaction.restore``` from `Transaction`

**October 2024**
* Exposed ```payload``` property on all objects from `bkper-js` interface
* Added `Collection.addBooks`
* Added `Collection.create`
* Added `Collection.getOwnerUsername`
* Added `Collection.getPermission`
* Added `Collection.getUpdatedAt`
* Added `Collection.remove`
* Added `Collection.removeBooks`
* Added `Collection.setName`
* Added `Collection.update`
* Added `Bkper.getBillingPortalUrl`
* Added `Connection.getDateAddedMs`
* Added `Connection.getLogo`
* Added `Connection.remove`
* Added `Integration.getAddedBy`
* Added `Integration.getAgentId`
* Added `Integration.getDateAddedMs`
* Added `Integration.getLastUpdateMs`
* Added `Integration.getLogo`
* Added `Integration.remove`
* Added `TransactionList` returned from `Book.listTransactions`
* Removed ```TransactionIterator``` from `Transaction`
* Removed ```newTransaction``` from `Book`. Use `Transaction` constructor instead
* Removed ```newAccount``` from `Book`. Use `Account` constructor instead
* Removed ```newGroup``` from `Book`. Use `Group` constructor instead
* Removed ```newFile``` from `Book`. Use `File` constructor instead

**September 2024**
* Extracted `bkper-js` from `bkper` as a standalone library.
* Added `Config.requestRetryHandler`
* Added `Visibility` enum
* Added `App.json`
* Added `Bkper.getApps`
* Added `Bkper.getBooks`
* Added `Bkper.getTemplates`
* Added `Bkper.newBook`
* Added `Book.getTotalTransactions`
* Added `Book.getTotalTransactionsCurrentMonth`
* Added `Book.getTotalTransactionsCurrentYear`
* Added `Book.getVisibility`
* Added `Book.create`
* Added `Collection.json`
* Added `Template`
* Added `Template.getBookId`
* Added `Template.getBookLink`
* Added `Template.getCategory`
* Added `Template.getDescription`
* Added `Template.getImageUrl`
* Added `Template.getName`
* Added `Template.getSheetsLink`
* Added `Template.getTimesUsed`
* Added `Template.json`
* Added `User.getEmail`
* Added `User.getHostedDomain`
* Added `User.isFree`
* Added `User.hasStartedTrial`
* Added `User.getDaysLeftInTrial`
* Added `User.hasUsedConnections`
* Added `User.json`

**January 2024**
* Added `Transaction.setChecked`


2023
----

**June 2023**
* Added `Bkper.getUser`
* Added `Bkper.setConfig`
* Added `Book.batchTrashTransactions`
* Added `Book.createIntegration`
* Added `Book.getIntegrations`
* Added `Book.updateIntegration`
* Added `Config` interface
* Added `Connection`
* Added `Connection.clearTokenProperties`
* Added `Connection.create`
* Added `Connection.deleteProperty`
* Added `Connection.getAgentId`
* Added `Connection.getEmail`
* Added `Connection.getId`
* Added `Connection.getIntegrations`
* Added `Connection.getName`
* Added `Connection.getProperties`
* Added `Connection.getProperty`
* Added `Connection.getPropertyKeys`
* Added `Connection.getType`
* Added `Connection.getUUID`
* Added `Connection.json`
* Added `Connection.setAgentId`
* Added `Connection.setName`
* Added `Connection.setProperties`
* Added `Connection.setProperty`
* Added `Connection.setType`
* Added `Connection.setUUID`
* Added `Integration`
* Added `Integration.deleteProperty`
* Added `Integration.getBookId`
* Added `Integration.getId`
* Added `Integration.getName`
* Added `Integration.getProperties`
* Added `Integration.getProperty`
* Added `Integration.json`
* Added `Integration.setProperties`
* Added `Integration.setProperty`
* Added `User`
* Added `User.getConnection`
* Added `User.getConnections`
* Added `User.getFullName`
* Added `User.getId`
* Added `User.getName`
* Deprecated `Bkper.setApiKey`
* Deprecated `Bkper.setOAuthTokenProvider`


2022
----

**September 2022**
* Deprecated `Account.getBalance`

**May 2022**
* Added `Book.parseDate`

**April 2022**
* Added `Book.getClosingDate`
* Added `Book.setClosingDate`


2021
----

**October 2021**
* Added `Book.getGroupsByAccount`

**May 2021**
* Added `Group.getParent`
* Added `Group.setParent`
* **BREAKING CHANGE:** Removed `AccountsDataTableBuilder`
* **BREAKING CHANGE:** Removed `BalancesDataTableBuilder`
* **BREAKING CHANGE:** Removed `TransactionsDataTableBuilder`
* **BREAKING CHANGE:** Removed `BalancesReport`
* **BREAKING CHANGE:** Removed `Balance`
* **BREAKING CHANGE:** Removed `BalancesContainer`

**April 2021**
* Added `Book.getLockDate`
* Added `Book.setLockDate`

**March 2021**
* **BREAKING CHANGE:** Removed `BalanceCheckedType`

**February 2021**
* Added `Book.getPeriod`
* Added `Book.setPeriod`
* Added `Book.getPeriodStartMonth`
* Added `Book.setPeriodStartMonth`
* Added `Book.getPageSize`
* Added `Book.setPageSize`

**January 2021**
* `bkper` client library published