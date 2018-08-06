'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = new (function () {
  function Pagination() {
    _classCallCheck(this, Pagination);
  }

  _createClass(Pagination, [{
    key: 'responseMiddlewareAsync',
    value: function responseMiddlewareAsync(input) {
      var jqXHR = input.jqXHR,
          data = input.data;

      if (!jqXHR) {
        return Promise.resolve(input);
      } // The plugins are all used in `octo.parse()` which does not have a jqXHR

      // Only JSON responses have next/prev/first/last link headers
      // Add them to data so the resolved value is iterable

      if (Array.isArray(data)) {
        data = { items: data.slice() // Convert to object so we can add the next/prev/first/last link headers

          // Parse the Link headers
          // of the form `<http://a.com>; rel="next", <https://b.com?a=b&c=d>; rel="previous"`
        };var linksHeader = jqXHR.headers.get('Link');
        if (linksHeader) {
          linksHeader.split(',').forEach(function (part) {
            var _part$match = part.match(/<([^>]+)>; rel="([^"]+)"/),
                _part$match2 = _slicedToArray(_part$match, 3),
                unusedField = _part$match2[0],
                href = _part$match2[1],
                rel = _part$match2[2];
            // Add the pagination functions on the JSON since Promises resolve one value
            // Name the functions `nextPage`, `previousPage`, `firstPage`, `lastPage`


            data[rel + '_page_url'] = href;
          });
        }
        input.data = data; // or throw new Error('BUG! Expected JSON data to exist')
      }
      return Promise.resolve(input);
    }
  }]);

  return Pagination;
}())();
//# sourceMappingURL=pagination.js.map