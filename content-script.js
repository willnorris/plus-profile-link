/*
 * Copyright (c) 2011 Will Norris. Licensed under the Apache License, Version 2.0.
 */

// test if any links to a Google+ profile are present

var gplus_rels = ['author', 'publisher'];
var href_regex = /https?:\/\/plus.google.com\//

var link_tags = document.getElementsByTagName('link');
var a_tags = document.getElementsByTagName('a');

var links = [].concat(link_tags, a_tags);

var found = false;
if (!found) {
  found = walk_nodelist(document.getElementsByTagName('link'));
}
if (!found) {
  found = walk_nodelist(document.getElementsByTagName('a'));
}

function walk_nodelist(nodes) {
  for(var i=0; i<nodes.length; i++) {
    var href = nodes[i].getAttribute('href');
    // handle scheme-less URLs
    if ( href.indexOf('//') == 0 ) {
      href = 'http:' + href;
    }
    var rel_attr = nodes[i].getAttribute('rel');
    var rels = rel_attr ? rel_attr.split(' ') : [];
    for(var j=0; j<rels.length; j++) {
      if (gplus_rels.indexOf(rels[j]) >= 0 && href_regex.test(href)) {
        console.log(nodes[i]);

        // found Google+ profile link, so notify the background page.
        var request = { 'href': href };
        chrome.extension.sendRequest(request, function(response) {});
        return true;
      }
    }
  }
  return false;
}
