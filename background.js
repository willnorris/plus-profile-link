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

    case "getProfileData":
      var profileId;
      if (request.profileId) {
        profileId = request.profileId;
      } else {
        var tab = request.tab ? request.tab : sender.tab;
        profileId = profileIds[tab.id];
      }
      getProfileData(profileId, function(data) {
        sendResponse(data);
      });
      break;

    case "sgapiLookup":
      if (localStorage['use_sgapi'] == 'true') {
        var tab = request.tab ? request.tab : sender.tab;
        sgapiLookup(tab.url, function(id) {
          profileIds[tab.id] = id;
          chrome.pageAction.show(tab.id);
          sendResponse({});
        });
      }
      break;
  }
});


/**
 * Cleanup when tabs are closed.
 */
chrome.tabs.onRemoved.addListener(function(tabId) {
  delete profileIds[tabId];
});

