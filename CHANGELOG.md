### **Changelog**

See what's new and what has changed in bkper-js

2025
----

**July 2025**
* **BREAKING CHANGE:** Refactored `Bkper` class from static methods to constructor-based pattern
* **BREAKING CHANGE:** Removed deprecated methods: `Transaction.remove()`, `Transaction.restore()`, `Account.getBalance()`, `Account.getBalanceRaw()`
* **MIGRATION:** Use `transaction.trash()` and `transaction.untrash()` instead of `remove()` and `restore()`
* **MIGRATION:** Use `Book.getBalancesReport()` instead of `Account.getBalance()` methods

**June 2025**   
* Added [Book.copy](/docs/bkper-js/#book_copy)
* Added [Transaction.getUpdatedAt](/docs/bkper-js/#transaction_getupdatedat)
* Added [Transaction.getUpdatedAtFormatted](/docs/bkper-js/#transaction_getupdatedatformatted)

**May 2025**
* Added [Group.isLocked](/docs/bkper-js/#group_islocked)
* Added [Group.setLocked](/docs/bkper-js/#group_setlocked)
* Added [Message.stream](/docs/bkper-js/#message_stream)
* Added [Query](/docs/bkper-js/#query)
* Added [Query.json](/docs/bkper-js/#query_getbook)
* Added [Query.getId](/docs/bkper-js/#query_getid)
* Added [Query.getTitle](/docs/bkper-js/#query_gettitle)
* Added [Query.setTitle](/docs/bkper-js/#query_settitle)
* Added [Query.getQuery](/docs/bkper-js/#query_getquery)
* Added [Query.setQuery](/docs/bkper-js/#query_setquery)
* Added [Query.create](/docs/bkper-js/#query_create)
* Added [Query.update](/docs/bkper-js/#query_update)
* Added [Query.remove](/docs/bkper-js/#query_remove)
* Added [Book.getSavedQueries](/docs/bkper-js/#book_getsavedqueries)
* Added [Book.batchPostTransactions](/docs/bkper-js/#book_batchposttransactions)
* Added [Book.batchCheckTransactions](/docs/bkper-js/#book_batchchecktransactions)
* Added [Book.batchUncheckTransactions](/docs/bkper-js/#book_batchunchecktransactions)
* Added [Book.batchUpdateTransactions](/docs/bkper-js/#book_batchupdatetransactions)
* Added [Book.batchUntrashTransactions](/docs/bkper-js/#book_batchuntrashtransactions)

**April 2025**
* Added [Book.batchCreateAccounts](/docs/bkper-js/#book_batchcreateaccounts)
* Added [Book.batchCreateGroups](/docs/bkper-js/#book_batchcreategroups)

**March 2025**
* Added [Agent.getLogoUrlDark](/docs/bkper-js/#agent_getlogourldark)
* Added [App.getFilePatterns](/docs/bkper-js/#app_getfilepatterns)
* Added [App.getLogoUrlDark](/docs/bkper-js/#app_getlogourldark)
* Added [App.getOwnerLogoUrl](/docs/bkper-js/#app_getownerlogourl)
* Added [App.getOwnerName](/docs/bkper-js/#app_getownername)
* Added [App.isConversational](/docs/bkper-js/#app_isconversational)
* Added [App.isPublished](/docs/bkper-js/#app_ispublished)
* Added [App.setConversationUrlDev](/docs/bkper-js/#app_setconversationurldev)
* Added [Bkper.getConversations](/docs/bkper-js/#app_getconversations)
* Added [Conversation](/docs/bkper-js/#conversation)
* Added [Conversation.create](/docs/bkper-js/#conversation_create)
* Added [Conversation.getAgent](/docs/bkper-js/#conversation_getagent)
* Added [Conversation.getCreatedAt](/docs/bkper-js/#conversation_getcreatedat)
* Added [Conversation.getId](/docs/bkper-js/#conversation_getid)
* Added [Conversation.getMessages](/docs/bkper-js/#conversation_getmessages)
* Added [Conversation.getTitle](/docs/bkper-js/#conversation_gettitle)
* Added [Conversation.getUpdatedAt](/docs/bkper-js/#conversation_getupdatedat)
* Added [Conversation.json](/docs/bkper-js/#conversation_json)
* Added [Message](/docs/bkper-js/#message)
* Added [Message.create](/docs/bkper-js/#message_create)
* Added [Message.deleteProperty](/docs/bkper-js/#message_deleteproperty)
* Added [Message.getAgent](/docs/bkper-js/#message_getagent)
* Added [Message.getCreatedAt](/docs/bkper-js/#message_getcreatedat)
* Added [Message.getContent](/docs/bkper-js/#message_getcontent)
* Added [Message.getConversation](/docs/bkper-js/#message_getconversation)
* Added [Message.getId](/docs/bkper-js/#message_getid)
* Added [Message.getProperties](/docs/bkper-js/#message_getproperties)
* Added [Message.getProperty](/docs/bkper-js/#message_getproperty)
* Added [Message.getUser](/docs/bkper-js/#message_getuser)
* Added [Message.setContent](/docs/bkper-js/#message_setcontent)
* Added [Message.setProperties](/docs/bkper-js/#message_setproperties)
* Added [Message.setProperty](/docs/bkper-js/#message_setproperty)
* Added [Message.json](/docs/bkper-js/#message_json)
* Added [Transaction.getAgentName](/docs/bkper-js/#transaction_getagentname)
* Added [Transaction.getAgentLogoUrl](/docs/bkper-js/#transaction_getagentlogourl)
* Added [Transaction.getAgentLogoUrlDark](/docs/bkper-js/#transaction_getagentlogourldark)

**February 2025**
* Added [EventType](/docs/bkper-js/#eventtype) enum
* Added [BotResponseType](/docs/bkper-js/#botresponsetype) enum
* Added [Agent](/docs/bkper-js/#agent)
* Added [Agent.getId](/docs/bkper-js/#agent_getid)
* Added [Agent.getLogoUrl](/docs/bkper-js/#agent_getlogourl)
* Added [Agent.getName](/docs/bkper-js/#agent_getname)
* Added [Agent.json](/docs/bkper-js/#agent_json)
* Added [App.getDescription](/docs/bkper-js/#app_getdescription)
* Added [App.getEvents](/docs/bkper-js/#app_getevents)
* Added [App.getLogoUrl](/docs/bkper-js/#app_getlogourl)
* Added [App.getName](/docs/bkper-js/#app_getname)
* Added [App.hasEvents](/docs/bkper-js/#app_hasevents)
* Added [Book.batchReplayEvents](/docs/bkper-js/#book_batchreplayevents)
* Added [Book.getApps](/docs/bkper-js/#book_getapps)
* Added [BotResponse](/docs/bkper-js/#botresponse)
* Added [BotResponse.getAgentId](/docs/bkper-js/#botresponse_getagentid)
* Added [BotResponse.getCreatedAt](/docs/bkper-js/#botresponse_getcreatedat)
* Added [BotResponse.getEvent](/docs/bkper-js/#botresponse_getevent)
* Added [BotResponse.getMessage](/docs/bkper-js/#botresponse_getmessage)
* Added [BotResponse.getType](/docs/bkper-js/#botresponse_gettype)
* Added [BotResponse.remove](/docs/bkper-js/#botresponse_remove)
* Added [BotResponse.replay](/docs/bkper-js/#botresponse_replay)
* Added [Event.getAgent](/docs/bkper-js/#event_getagent)
* Added [Event.getBook](/docs/bkper-js/#event_getbook)
* Added [Event.getBotResponses](/docs/bkper-js/#event_getbotresponses)
* Added [Event.getCreatedAt](/docs/bkper-js/#event_getcreatedat)
* Added [Event.getId](/docs/bkper-js/#event_getid)
* Added [Event.getType](/docs/bkper-js/#event_gettype)
* Added [Event.getUser](/docs/bkper-js/#event_getuser)
* Added [Event.hasErrorResponse](/docs/bkper-js/#event_haserrorresponse)
* Added [User.getAvatarUrl](/docs/bkper-js/#user_getavatarurl)

**January 2025**
* Added [BalancesContainer](/docs/bkper-js/#balancescontainer)
* Added [BalancesContainer.getName](/docs/bkper-js/#balancescontainer_getname)
* Added [BalancesContainer.getNormalizedName](/docs/bkper-js/#balancescontainer_getnormalizedname)
* Added [BalancesContainer.getGroup](/docs/bkper-js/#balancescontainer_getgroup)
* Added [BalancesContainer.getAccount](/docs/bkper-js/#balancescontainer_getaccount)
* Added [BalancesContainer.getParent](/docs/bkper-js/#balancescontainer_getparent)
* Added [BalancesContainer.getDepth](/docs/bkper-js/#balancescontainer_getdepth)
* Added [BalancesContainer.isCredit](/docs/bkper-js/#balancescontainer_iscredit)
* Added [BalancesContainer.isPermanent](/docs/bkper-js/#balancescontainer_ispermanent)
* Added [BalancesContainer.isFromAccount](/docs/bkper-js/#balancescontainer_isfromaccount)
* Added [BalancesContainer.isFromGroup](/docs/bkper-js/#balancescontainer_isfromgroup)
* Added [BalancesContainer.hasGroupBalances](/docs/bkper-js/#balancescontainer_hasgroupbalances)
* Added [BalancesContainer.getCumulativeBalance](/docs/bkper-js/#balancescontainer_getcumulativebalance)
* Added [BalancesContainer.getCumulativeBalanceRaw](/docs/bkper-js/#balancescontainer_getcumulativebalanceraw)
* Added [BalancesContainer.getCumulativeBalanceText](/docs/bkper-js/#balancescontainer_getcumulativebalancetext)
* Added [BalancesContainer.getCumulativeBalanceRawText](/docs/bkper-js/#balancescontainer_getcumulativebalancerawtext)
* Added [BalancesContainer.getPeriodBalance](/docs/bkper-js/#balancescontainer_getperiodbalance)
* Added [BalancesContainer.getPeriodBalanceRaw](/docs/bkper-js/#balancescontainer_getperiodbalanceraw)
* Added [BalancesContainer.getPeriodBalanceText](/docs/bkper-js/#balancescontainer_getperiodbalancetext)
* Added [BalancesContainer.getPeriodBalanceRawText](/docs/bkper-js/#balancescontainer_getperiodbalancerawtext)
* Added [BalancesContainer.getBalancesContainers](/docs/bkper-js/#balancescontainer_getbalancescontainers)
* Added [BalancesContainer.getBalancesContainer](/docs/bkper-js/#balancescontainer_getbalancescontainer)
* Added [BalancesReport](/docs/bkper-js/#balancesreport)
* Added [BalancesReport.getBook](/docs/bkper-js/#balancesreport_getbook)
* Added [BalancesReport.getPeriod](/docs/bkper-js/#balancesreport_getperiod)
* Added [BalancesReport.getBalancesContainers](/docs/bkper-js/#balancesreport_getbalancescontainers)
* Added [BalancesReport.getBalancesContainer](/docs/bkper-js/#balancesreport_getbalancescontainer)
* Added [Book.getAutoPost](/docs/bkper-js/#book_getautopost)
* Added [Book.setAutoPost](/docs/bkper-js/#book_setautopost)
* Added [Group.isCredit](/docs/bkper-js/#group_iscredit)
* Added [Group.isMixed](/docs/bkper-js/#group_ismixed)
* Added [User.getPlan](/docs/bkper-js/#user_getplan)
* Added [User.hasBillingEnabled](/docs/bkper-js/#user_hasbillingenabled)


2024
----

**December 2024**
* Added [Book.listEvents](/docs/bkper-js/#book_listevents)
* Added [EventList](/docs/bkper-js/#eventlist)
* Added [EventList.getCursor](/docs/bkper-js/#eventlist_getcursor)
* Added [EventList.getFirst](/docs/bkper-js/#eventlist_getfirst)
* Added [EventList.getItems](/docs/bkper-js/#eventlist_getitems)
* Added [EventList.size](/docs/bkper-js/#eventlist_size)
* Added [Group.isPermanent](/docs/bkper-js/#group_ispermanent)
* Added [Group.hasParent](/docs/bkper-js/#group_hasparent)
* Added [Group.getChildren](/docs/bkper-js/#group_getchildren)
* Added [Group.getDescendants](/docs/bkper-js/#group_getdescendants)
* Added [Group.getDescendantTreeIds](/docs/bkper-js/#group_getdescendanttreeids)
* Added [Group.hasChildren](/docs/bkper-js/#group_haschildren)
* Added [Group.isLeaf](/docs/bkper-js/#group_isleaf)
* Added [Group.isRoot](/docs/bkper-js/#group_isroot)
* Added [Group.getDepth](/docs/bkper-js/#group_getdepth)
* Added [Group.getRoot](/docs/bkper-js/#group_getroot)
* Added [Group.getRootName](/docs/bkper-js/#group_getrootname)
* Added [Group.hasAccounts](/docs/bkper-js/#group_hasaccounts)

**November 2024**
* Added [Transaction.trash](/docs/bkper-js/#transaction_trash)
* Added [Transaction.untrash](/docs/bkper-js/#transaction_untrash)
* Added [Transaction.getAmountFormatted](/docs/bkper-js/#transaction_getamountformatted)
* Added [Transaction.isLocked](/docs/bkper-js/#transaction_islocked)
* Removed ```Transaction.remove``` from [Transaction](/docs/bkper-js/#transaction)
* Removed ```Transaction.restore``` from [Transaction](/docs/bkper-js/#transaction)

**October 2024**
* Exposed ```payload``` property on all objects from [bkper-js](/docs/bkper-js) interface
* Added [Collection.addBooks](/docs/bkper-js/#collection_addbooks)
* Added [Collection.create](/docs/bkper-js/#collection_create)
* Added [Collection.getOwnerUsername](/docs/bkper-js/#collection_getownerusername)
* Added [Collection.getPermission](/docs/bkper-js/#collection_getpermission)
* Added [Collection.getUpdatedAt](/docs/bkper-js/#collection_getupdatedat)
* Added [Collection.remove](/docs/bkper-js/#collection_remove)
* Added [Collection.removeBooks](/docs/bkper-js/#collection_removebooks)
* Added [Collection.setName](/docs/bkper-js/#collection_setname)
* Added [Collection.update](/docs/bkper-js/#collection_update)
* Added [Bkper.getBillingPortalUrl](/docs/bkper-js/#bkper_getbillingportalurl)
* Added [Connection.getDateAddedMs](/docs/bkper-js/#connection_getdateaddedms)
* Added [Connection.getLogo](/docs/bkper-js/#connection_getlogo)
* Added [Connection.remove](/docs/bkper-js/#connection_remove)
* Added [Integration.getAddedBy](/docs/bkper-js/#integration_getaddedby)
* Added [Integration.getAgentId](/docs/bkper-js/#integration_getagentid)
* Added [Integration.getDateAddedMs](/docs/bkper-js/#integration_getdateaddedms)
* Added [Integration.getLastUpdateMs](/docs/bkper-js/#integration_getlastupdatems)
* Added [Integration.getLogo](/docs/bkper-js/#integration_getlogo)
* Added [Integration.remove](/docs/bkper-js/#integration_remove)
* Added [TransactionList](/docs/bkper-js/#transactionlist) returned from [Book.listTransactions](/docs/bkper-js/#book_listtransactions)
* Removed ```TransactionIterator``` from [Transaction](/docs/bkper-js/#transaction)
* Removed ```newTransaction``` from [Book](/docs/bkper-js/#book). Use [Transaction](/docs/bkper-js/#transaction) constructor instead
* Removed ```newAccount``` from [Book](/docs/bkper-js/#book). Use [Account](/docs/bkper-js/#account) constructor instead
* Removed ```newGroup``` from [Book](/docs/bkper-js/#book). Use [Group](/docs/bkper-js/#group) constructor instead
* Removed ```newFile``` from [Book](/docs/bkper-js/#book). Use [File](/docs/bkper-js/#file) constructor instead

**September 2024**
* Extracted [bkper-js](https://github.com/bkper/bkper-js) from [bkper](https://github.com/bkper/bkper-node) as a standalone library.
* Added [Config.requestRetryHandler](/docs/bkper-js/#config_requestretryhandler)
* Added [Visibility](/docs/bkper-js/#visibility) enum
* Added [App.json](/docs/bkper-js/#app_json)
* Added [Bkper.getApps](/docs/bkper-js/#bkper_getapps)
* Added [Bkper.getBooks](/docs/bkper-js/#bkper_getbooks)
* Added [Bkper.getTemplates](/docs/bkper-js/#bkper_gettemplates)
* Added [Bkper.newBook](/docs/bkper-js/#bkper_newbook)
* Added [Book.getTotalTransactions](/docs/bkper-js/#book_gettotaltransactions)
* Added [Book.getTotalTransactionsCurrentMonth](/docs/bkper-js/#book_gettotaltransactionscurrentmonth)
* Added [Book.getTotalTransactionsCurrentYear](/docs/bkper-js/#book_gettotaltransactionscurrentyear)
* Added [Book.getVisibility](/docs/bkper-js/#book_getvisibility)
* Added [Book.create](/docs/bkper-js/#book_create)
* Added [Collection.json](/docs/bkper-js/#collection_json)
* Added [Template](/docs/bkper-js/#template)
* Added [Template.getBookId](/docs/bkper-js/#template_getbookid)
* Added [Template.getBookLink](/docs/bkper-js/#template_getbooklink)
* Added [Template.getCategory](/docs/bkper-js/#template_getcategory)
* Added [Template.getDescription](/docs/bkper-js/#template_getdescription)
* Added [Template.getImageUrl](/docs/bkper-js/#template_getimageurl)
* Added [Template.getName](/docs/bkper-js/#template_getname)
* Added [Template.getSheetsLink](/docs/bkper-js/#template_getsheetslink)
* Added [Template.getTimesUsed](/docs/bkper-js/#template_gettimesused)
* Added [Template.json](/docs/bkper-js/#template_json)
* Added [User.getEmail](/docs/bkper-js/#user_getemail)
* Added [User.getHostedDomain](/docs/bkper-js/#user_gethosteddomain)
* Added [User.isFree](/docs/bkper-js/#user_isfree)
* Added [User.hasStartedTrial](/docs/bkper-js/#user_hasstartedtrial)
* Added [User.getDaysLeftInTrial](/docs/bkper-js/#user_getdaysleftintrial)
* Added [User.hasUsedConnections](/docs/bkper-js/#user_hasusedconnections)
* Added [User.json](/docs/bkper-js/#user_json)

**January 2024**
* Added [Transaction.setChecked](/docs/bkper-js/#transaction_setchecked)


2023
----

**June 2023**
* Added [Bkper.getUser](/docs/bkper-js/#bkper_getuser)
* Added [Bkper.setConfig](/docs/bkper-js/#bkper_setconfig)
* Added [Book.batchTrashTransactions](/docs/bkper-js/#book_batchtrashtransactions)
* Added [Book.createIntegration](/docs/bkper-js/#book_createintegration)
* Added [Book.getIntegrations](/docs/bkper-js/#book_getintegrations)
* Added [Book.updateIntegration](/docs/bkper-js/#book_updateintegration)
* Added [Config](/docs/bkper-js/#config) interface
* Added [Connection](/docs/bkper-js/#connection)
* Added [Connection.clearTokenProperties](/docs/bkper-js/#connection_cleartokenproperties)
* Added [Connection.create](/docs/bkper-js/#connection_create)
* Added [Connection.deleteProperty](/docs/bkper-js/#connection_deleteproperty)
* Added [Connection.getAgentId](/docs/bkper-js/#connection_getagentid)
* Added [Connection.getEmail](/docs/bkper-js/#connection_getemail)
* Added [Connection.getId](/docs/bkper-js/#connection_getid)
* Added [Connection.getIntegrations](/docs/bkper-js/#connection_getintegrations)
* Added [Connection.getName](/docs/bkper-js/#connection_getname)
* Added [Connection.getProperties](/docs/bkper-js/#connection_getproperties)
* Added [Connection.getProperty](/docs/bkper-js/#connection_getproperty)
* Added [Connection.getPropertyKeys](/docs/bkper-js/#connection_getpropertykeys)
* Added [Connection.getType](/docs/bkper-js/#connection_gettype)
* Added [Connection.getUUID](/docs/bkper-js/#connection_getuuid)
* Added [Connection.json](/docs/bkper-js/#connection_json)
* Added [Connection.setAgentId](/docs/bkper-js/#connection_setagentid)
* Added [Connection.setName](/docs/bkper-js/#connection_setname)
* Added [Connection.setProperties](/docs/bkper-js/#connection_setproperties)
* Added [Connection.setProperty](/docs/bkper-js/#connection_setproperty)
* Added [Connection.setType](/docs/bkper-js/#connection_settype)
* Added [Connection.setUUID](/docs/bkper-js/#connection_setuuid)
* Added [Integration](/docs/bkper-js/#integration)
* Added [Integration.deleteProperty](/docs/bkper-js/#integration_deleteproperty)
* Added [Integration.getBookId](/docs/bkper-js/#integration_getbookid)
* Added [Integration.getId](/docs/bkper-js/#integration_getid)
* Added [Integration.getName](/docs/bkper-js/#integration_getname)
* Added [Integration.getProperties](/docs/bkper-js/#integration_getproperties)
* Added [Integration.getProperty](/docs/bkper-js/#integration_getproperty)
* Added [Integration.json](/docs/bkper-js/#integration_json)
* Added [Integration.setProperties](/docs/bkper-js/#integration_setproperties)
* Added [Integration.setProperty](/docs/bkper-js/#integration_setproperty)
* Added [User](/docs/bkper-js/#user)
* Added [User.getConnection](/docs/bkper-js/#user_getconnection)
* Added [User.getConnections](/docs/bkper-js/#user_getconnections)
* Added [User.getFullName](/docs/bkper-js/#user_getfullname)
* Added [User.getId](/docs/bkper-js/#user_getid)
* Added [User.getName](/docs/bkper-js/#user_getname)
* Deprecated [Bkper.setApiKey](/docs/bkper-js/#bkper_setapikey)
* Deprecated [Bkper.setOAuthTokenProvider](/docs/bkper-js/#bkper_setoauthtokenprovider)


2022
----

**September 2022**
* Deprecated [Account.getBalance](/docs/bkper-js/#account_getbalance)

**May 2022**
* Added [Book.parseDate](/docs/bkper-js/#book_parsedate) 

**April 2022**
* Added [Book.getClosingDate](/docs/bkper-js/#book_getclosingdate) 
* Added [Book.setClosingDate](/docs/bkper-js/#book_setclosingdate) 


2021
----

**October 2021**
* Added [Book.getGroupsByAccount](/docs/bkper-js/#book_getgroupsbyaccount) 

**May 2021**
* Added [Group.getParent](/docs/bkper-js/#group_getparent)  
* Added [Group.setParent](/docs/bkper-js/#group_setparent)  
* **BREAKING CHANGE:** Removed **AccountsDataTableBuilder**
* **BREAKING CHANGE:** Removed **BalancesDataTableBuilder**
* **BREAKING CHANGE:** Removed **TransactionsDataTableBuilder**
* **BREAKING CHANGE:** Removed **BalancesReport**
* **BREAKING CHANGE:** Removed **Balance**
* **BREAKING CHANGE:** Removed **BalancesContainer**

**April 2021**
* Added [Book.getLockDate](/docs/bkper-js/#book_getlockdate)  
* Added [Book.setLockDate](/docs/bkper-js/#book_setlockdate)  

**March 2021**
* **BREAKING CHANGE:** : Removed **BalanceCheckedType**

**February 2021**
* Added [Book.getPeriod](/docs/bkper-js/#book_getperiod)  
* Added [Book.setPeriod](/docs/bkper-js/#book_setperiod)  
* Added [Book.getPeriodStartMonth](/docs/bkper-js/#book_getperiodstartmonth)  
* Added [Book.setPeriodStartMonth](/docs/bkper-js/#book_setperiodstartmonth)  
* Added [Book.getPageSize](/docs/bkper-js/#book_getpagesize)  
* Added [Book.setPageSize](/docs/bkper-js/#book_setpagesize)  

**January 2021**
* [bkper](https://www.npmjs.com/package/bkper) client library published