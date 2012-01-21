/**
 * Dictionary of detected profile URLs keyed off of tabId.
 */
var profileUrls = {}


/**
 * Listen for the content script to send a message to the background page.
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  switch (request.method) {
    case "setProfileUrl":
      profileUrls[sender.tab.id] = request.url;
      chrome.pageAction.show(sender.tab.id);
      sendResponse({});
      break;

    case "getProfileUrl":
      var tab = request.tab ? request.tab : sender.tab;
      sendResponse({url:profileUrls[tab.id]});
      break;

    case "openProfileUrl":
      var tab = request.tab ? request.tab : sender.tab;
      chrome.tabs.create({
        'url': profileUrls[tab.id],
        'index': tab.index + 1
      }, function(tab) {
        // mark new tab as selected so that popup window hides
        chrome.tabs.update(tab.id, {selected:true});
      });
      break;
  }
});


/**
 * Cleanup when tabs are closed.
 */
chrome.tabs.onRemoved.addListener(function(tabId) {
  delete profileUrls[tabId];
});

