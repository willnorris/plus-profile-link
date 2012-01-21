var gplus_rels = ['author', 'publisher', 'me'];
var href_regex = /^https?:\/\/plus.google.com\/.+/

/**
 * Determine if the provided link element contains a link to a Google+ profile.
 * The be considered a valid Google+ profile link, the href must be to a
 * plus.google.com URL, and the link must contain a supported rel value
 * (author, publisher, or me).  The rel value can be specified in the "rel"
 * attribute, or as a query paramter on the href URL.
 *
 * @param {Element} link the <link> or <a> element to check
 * @returns {String} the Google+ profile URL in the link, or null if the
 *                   provided link does not contain a Google+ profile URL
 */
function getProfileUrl(link) {
  var href = link.getAttribute('href');

  // handle scheme-less URLs
  if ( href.indexOf('//') == 0 ) {
    href = 'https:' + href;
  }

  var rel_attr = link.getAttribute('rel');
  var rels = rel_attr ? rel_attr.split(' ') : [];

  if (href_regex.test(href)) {
    for (var i=0; i<rels.length; i++) {
      if (gplus_rels.indexOf(rels[i]) >= 0) {
        return href;
      }
    }
  }

  return null;
}
