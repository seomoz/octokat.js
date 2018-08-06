'use strict';

if (typeof window.fetch === 'function') {
  module.exports = window.fetch.bind(window);
} else {
  module.exports = function () {
    throw new Error('Octokat Error: window.fetch function not found. Either use the https://npmjs.com/package/whatwg-fetch polyfill or set Octokat.Fetch variable to be the fetch function');
  };
}
//# sourceMappingURL=fetch-browser.js.map