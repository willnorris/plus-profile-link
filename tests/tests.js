test("link detection", function() {
  // various permutations of the URL scheme
  testLinkProfile('http://plus.google.com/123', 'author', true);
  testLinkProfile('https://plus.google.com/123', 'author', true);

  // various rel values, including multi-value
  testLinkProfile('https://plus.google.com/123', 'author', true);
  testLinkProfile('https://plus.google.com/123', 'publisher', true);
  testLinkProfile('https://plus.google.com/123', 'me', true);
  testLinkProfile('https://plus.google.com/123', 'other author', true);
  testLinkProfile('https://plus.google.com/123', 'publisher other', true);

  // rel value included as query parameter on the URL
  testLinkProfile('https://plus.google.com/123?rel=author', '', true);
  testLinkProfile('https://plus.google.com/123?rel=other', '', null);

  // non-matching rel values
  testLinkProfile('https://plus.google.com/123', '', null);
  testLinkProfile('https://plus.google.com/123', 'authors', null);
  testLinkProfile('https://plus.google.com/123', 'other', null);

  // non-matching URLs
  testLinkProfile('https://plus.google.com/', 'author', null);
  testLinkProfile('http://example.com/', 'author', null);
});


test("brand badge detection", function() {
  var badge;

  badge = $('<g:plus href="http://plus.google.com/123">')[0];
  equals(getProfileUrl(badge), 'http://plus.google.com/123', badge);

  badge = $('<g:plus>', {href:'http://example.com/'})[0];
  equals(getProfileUrl(badge), null, badge);

  badge = $('<div>', {'data-href':'http://plus.google.com/123', 'class':'g-plus'})[0];
  console.log(badge);
  equals(getProfileUrl(badge), 'http://plus.google.com/123', badge);

  badge = $('<div>', {'data-href':'http://example.com/','class':'g-plus'})[0];
  equals(getProfileUrl(badge), null, badge);
});


/**
 * Test getting a profile URL from link data.
 *
 * @param {String} href the href value from the link element
 * @param {String} rel the rel value from the link element
 * @param {String|boolean} expected the expected profile URL detected in the
 *     link.  If set to 'true', use the value passed in for href.
 */
function testLinkProfile(href, rel, expected) {
  if (expected === true) {
    expected = href;
  }

  var link = $('<link>', {href:href,rel:rel})[0];
  equals(getProfileUrl(link), expected, "link with href:'" + href + "' and rel:'" + rel + "'");
}
