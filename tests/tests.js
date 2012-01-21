test("Link detection", function() {
  // various permutations of the URL scheme
  testLinkProfile('http://plus.google.com/123', 'author', true);
  testLinkProfile('https://plus.google.com/123', 'author', true);
  testLinkProfile('//plus.google.com/123', 'author', 'https://plus.google.com/123');

  // various rel values, including multi-value
  testLinkProfile('https://plus.google.com/123', 'author', true);
  testLinkProfile('https://plus.google.com/123', 'publisher', true);
  testLinkProfile('https://plus.google.com/123', 'me', true);
  testLinkProfile('https://plus.google.com/123', 'other author', true);

  // rel value included as query parameter on the URL
  testLinkProfile('https://plus.google.com/123?rel=author', '', 'https://plus.google.com/123');
  testLinkProfile('https://plus.google.com/123?rel=other', '', null);

  // non-matching rel values
  testLinkProfile('https://plus.google.com/123', '', null);
  testLinkProfile('https://plus.google.com/123', 'other', null);

  // non-matching URLs
  testLinkProfile('https://plus.google.com/', 'author', null);
  testLinkProfile('http://example.com/', 'author', null);
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
