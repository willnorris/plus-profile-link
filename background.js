function onRequest(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);

  chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': request.href});
  });

  sendResponse({});
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);


