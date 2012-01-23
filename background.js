/**
 * Dictionary of detected profile IDs keyed off of tabId.
 */
var profileIds = {}


/**
 * Listen for the content script to send a message to the background page.
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  switch (request.method) {
    case "setProfileId":
      profileIds[sender.tab.id] = request.id;
      chrome.pageAction.show(sender.tab.id);
      sendResponse({});
      break;

    case "getProfileId":
      var tab = request.tab ? request.tab : sender.tab;
      sendResponse({id:profileIds[tab.id]});
      break;
  }
});


/**
 * Cleanup when tabs are closed.
 */
chrome.tabs.onRemoved.addListener(function(tabId) {
  delete profileIds[tabId];
});

