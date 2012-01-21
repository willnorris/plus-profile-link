/**
 * Dictionary of detected profile URLs keyed off of tabId.
 */
var profileUrls = {}


/**
 * Listen for the content script to send a message to the background page.
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  profileUrls[sender.tab.id] = request.href;
  chrome.pageAction.show(sender.tab.id);

  sendResponse({});
});


/**
 * Open profile URL when the page action icon is clicked.
 */
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    'url': profileUrls[tab.id],
    'index': tab.index + 1
  });
});


/**
 * Cleanup when tabs are closed.
 */
chrome.tabs.onRemoved.addListener(function(tabId) {
  delete profileUrls[tabId];
});

