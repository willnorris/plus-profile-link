var valid_rels = ['author', 'publisher', 'me'];
var valid_host = 'plus.google.com';


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
  var url = parseURL(link.href);

  var rels = [];
  if (link.rel) rels = rels.concat(link.rel.split(' '));
  if (url.params.rel) rels = rels.concat(url.params.rel.split(' '));

  if (url.host == valid_host && url.path.length > 1) {
    for (var i=0; i<rels.length; i++) {
      if (valid_rels.indexOf(rels[i]) >= 0) {
        return url.source;
      }
    }
  }

  return null;
}


/**
 * Parse a URL using the DOM.
 *
 * @author James Padolsey
 * @see http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
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
