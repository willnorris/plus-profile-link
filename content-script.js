/*
 * Copyright (c) 2011 Will Norris. Licensed under the Apache License, Version 2.0.
 */

// test if any links to a Google+ profile are present
var found = false;
if (!found) {
  found = parseLinks(document.getElementsByTagName('link'));
}
if (!found) {
  found = parseLinks(document.getElementsByTagName('a'));
}
if (!found) {
  found = parseLinks(document.getElementsByTagName('g:plus'));
}
if (!found) {
  found = parseLinks(document.getElementsByClassName('g-plus'));
}


function parseLinks(links) {
  for(var i=0; i<links.length; i++) {
    var url = getProfileUrl(links[i]);
    if (url) {
      // found Google+ profile URL, so notify the background page.
      var request = { method:"setProfileUrl", url:url };
      chrome.extension.sendRequest(request, function(response) {});
      return true;
    }
  }

  return false;
}
