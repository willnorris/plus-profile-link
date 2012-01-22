test('get profile URL from link', function() {
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
  testLinkProfile('https://plus.google.com/123?rel=other', '', undefined);

  // non-matching rel values
  testLinkProfile('https://plus.google.com/123', '', undefined);
  testLinkProfile('https://plus.google.com/123', 'authors', undefined);
  testLinkProfile('https://plus.google.com/123', 'other', undefined);

  // non-matching URLs
  testLinkProfile('https://plus.google.com/', 'author', undefined);
  testLinkProfile('http://example.com/', 'author', undefined);
});


test('brand badge detection', function() {
  var badge;

  badge = $('<g:plus href="http://plus.google.com/123">')[0];
  equals(getProfileUrl(badge), 'http://plus.google.com/123', badge);

  badge = $('<g:plus>', {href:'http://example.com/'})[0];
  equals(getProfileUrl(badge), undefined, badge);

  badge = $('<div>', {'data-href':'http://plus.google.com/123', 'class':'g-plus'})[0];
  equals(getProfileUrl(badge), 'http://plus.google.com/123', badge);

  badge = $('<div>', {'data-href':'http://example.com/','class':'g-plus'})[0];
  equals(getProfileUrl(badge), undefined, badge);
});


test('extract profile ID', function() {
  testExtractProfileId('http://plus.google.com/123456789012345678901', '123456789012345678901');
  testExtractProfileId('http://plus.google.com/u/0/123456789012345678901', '123456789012345678901');
  testExtractProfileId('http://plus.google.com/b/0/123456789012345678901', '123456789012345678901');
  testExtractProfileId('http://plus.google.com/b/0/u/1/123456789012345678901', '123456789012345678901');
  testExtractProfileId('http://plus.google.com/123456789012345678901?prsrc=3', '123456789012345678901');

  testExtractProfileId('http://plus.google.com/12345', undefined);
});


test('get profile ID from link', function() {
  var link;

  link = $('<a>', {'href': 'http://plus.google.com/123456789012345678901', 'rel':'author'})[0];
  equals(getProfileId(link), '123456789012345678901', 'link with url: http://plus.google.com/123456789012345678901');
});


asyncTest('fetch profile data', function() {
  getProfileData('111832530347449196055', function(data) {
    equals(data.displayName, 'Will Norris', 'verify diaplay name');
    start();
  });
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
  equals(getProfileUrl(link), expected, 'link with href:"' + href + '" and rel:"' + rel + '"');
}


/**
 * Test extracting the ID from a profile URL.
 *
 * @param {String} url the url value to extract the ID from
 * @param {String} expected the expected profile ID
 */
function testExtractProfileId(url, expected) {
  equals(extractProfileId(url), expected, 'extract profile id from: ' + url);
}
