/*
 * Copyright (c) 2011 Will Norris. Licensed under the Apache License, Version 2.0.
 */

// test if any links to a Google+ profile are present
var found = false;
if (!found) {
  found = walk_nodelist(document.getElementsByTagName('link'));
}
if (!found) {
  found = walk_nodelist(document.getElementsByTagName('a'));
}

function walk_nodelist(nodes) {
  for(var i=0; i<nodes.length; i++) {
    var href = getProfileUrl(nodes[i]);
    if (href) {
      // found Google+ profile link, so notify the background page.
      console.log(nodes[i]);
      var request = { 'href': href };
      chrome.extension.sendRequest(request, function(response) {});
      return true;
    }
  }

  return false;
}
