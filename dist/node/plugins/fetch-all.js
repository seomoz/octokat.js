'use strict';

var toQueryString = require('../helpers/querystring');

var pushAll = function pushAll(target, source) {
  if (!Array.isArray(source)) {
    throw new Error('Octokat Error: Calling fetchAll on a request that does not yield an array');
  }
  return target.push.apply(target, source);
};

var getMore = function getMore(fetchable, requester, acc) {
  var nextPagePromise = fetchNextPage(fetchable, requester);
  if (nextPagePromise) {
    return nextPagePromise.then(function (results) {
      pushAll(acc, results.items);
      // TODO: handle `items.next_page = string/function`, `items.nextPage = string/function`
      return getMore(results, requester, acc);
    });
  } else {
    return acc;
  }
};

// TODO: HACK to handle camelCase and hypermedia plugins
var fetchNextPage = function fetchNextPage(obj, requester) {
  if (typeof obj.next_page_url === 'string') {
    return requester.request('GET', obj.next_page_url, null, null);
  } else if (obj.next_page) {
    return obj.next_page.fetch();
  } else if (typeof obj.nextPageUrl === 'string') {
    return requester.request('GET', obj.nextPageUrl, null, null);
  } else if (obj.nextPage) {
    return obj.nextPage.fetch();
  } else {
    return false;
  }
};

// new class FetchAll
module.exports = {
  asyncVerbs: {
    fetchAll: function fetchAll(requester, path) {
      return function (query) {
        // TODO: Pass in the instance so we can just call fromUrl maybe? and we don't rely on hypermedia to create nextPage
        return requester.request('GET', '' + path + toQueryString(query), null, null).then(function (results) {
          var acc = [];
          pushAll(acc, results.items);
          // TODO: handle `items.next_page = string/function`, `items.nextPage = string/function`
          return getMore(results, requester, acc);
        });
      };
    }
  }
};
//# sourceMappingURL=fetch-all.js.map