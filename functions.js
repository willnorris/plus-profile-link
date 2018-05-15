/*
 * Copyright (c) 2012 Google. Licensed under the Apache License, Version 2.0.
 */

var valid_rels = ['author', 'publisher', 'me'];
var valid_host = 'plus.google.com';
var api_key = 'AIzaSyBqg2LrzdDQpfhViIircxi1FBDFqjn34w4';


/**
 * Determine if the provided link element contains a link to a Google+ profile.
 * To be considered a valid Google+ profile link, the href must be to a
 * Google+ profile URL, and the link must contain a supported rel value
 * (author, publisher, or me).  The rel value can be specified in the "rel"
 * attribute, or as a query paramter on the href URL.
 *
 * @param {Element} link the <link> or <a> element to check
 * @returns {String} the Google+ profile URL in the link, or undefined if the
 *                   provided link does not contain a Google+ profile URL
 */
function getProfileUrl(link) {
  var url, rels = [];

  if (link.tagName == 'G:PLUS') {
    // Google+ brand badge
    url = parseURL(link.getAttribute('href'));
    rels.push('publisher');
  } else if (link.tagName == 'DIV') {
    // HTML5 Google+ brand badge
    url = parseURL(link.getAttribute('data-href'));
    rels.push('publisher');
  } else {
    url = parseURL(link.href);
  }

  if (link.rel) rels = rels.concat(link.rel.split(' '));
  if (url.params.rel) rels = rels.concat(url.params.rel.split(' '));

  if (url.host == valid_host && url.path.length > 1) {
    for (var i=0; i<rels.length; i++) {
      if (valid_rels.indexOf(rels[i]) >= 0) {
        return url.source;
      }
    }
  }
}


/**
 * Get the Google+ profile ID from the profiel URL in the provided link element.
 *
 * @param {Element} link the element to check
 * @returns {String} the Google+ profile ID in the element, or undefined if the
 *                   provided link does not contain a Google+ profile ID
 */
function getProfileId(link) {
  var url = getProfileUrl(link);
  if (url) {
    return extractProfileId(url);
  }
}


/**
 * Extract the Google+ profile ID from the profile URL.  The ID is a 21-digit
 * number that appears in the path of the profile URL.  Ideally, it should the
 * only thing in the path, but people will oftentimes copy and paste URLs that
 * contain multi-login data, which can be identified by path segements like
 * "/u/0/" or "/b/0/".  Just to make things easy, we extract the ID from the
 * URL by matching the first long string of numbers.
 *
 * @param {String} url Google+ profile URL to extract ID from
 * @returns {String} Google+ profile ID or undefined if ID not found
 */
function extractProfileId(url) {
  var id_regex = /[0-9]{21}/;
  var matches = id_regex.exec(url);
  if (matches) {
    return matches[0];
  }
}


/**
 * Fetch profile data from the Google+ API.  This function requires that jQuery
 * is present.
 *
 * @param {String} id Google+ profile ID to fetch
 * @param {Function} callback callback function called with profile data
 */
function getProfileData(id, callback) {
  jQuery.ajax({
    url: 'https://www.googleapis.com/plus/v1/people/' + id,
    dataType: 'jsonp',
    data: {
      'key': api_key
    },
    success: function(response, textStatus, xhr) {
      if (response.error) {
        console.error('Google+ API Error', response.error, xhr);
      } else {
        callback(response);
      }
    }
  });
}


/**
 * Parse a URL using the DOM.
 *
 * @author James Padolsey
 * @see http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
 * @param {String} url URL to parse
 * @returns {Object} object with parsed URL data
 */
function parseURL(url) {
  var a =  document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':',''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function(){
      var ret = {},
        seg = a.search.replace(/^\?/,'').split('&'),
        len = seg.length, i = 0, s;
      for (;i<len;i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
    hash: a.hash.replace('#',''),
    path: a.pathname.replace(/^([^\/])/,'/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
    segments: a.pathname.replace(/^\//,'').split('/')
  };
}
