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

    case "openProfileUrl":
      var tab = request.tab ? request.tab : sender.tab;
      chrome.tabs.create({
        'url': 'https://plus.google.com/' + profileIds[tab.id],
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
  delete profileIds[tabId];
});

