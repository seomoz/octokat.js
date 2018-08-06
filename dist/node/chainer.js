'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var plus = require('./plus');

// Daisy-Chainer
// ===============================
//
// Generates the functions so `octo.repos(...).issues.comments.fetch()` works.
// Constructs a URL for the verb methods (like `.fetch` and `.create`).

module.exports = function () {
  function Chainer(_verbMethods) {
    _classCallCheck(this, Chainer);

    this._verbMethods = _verbMethods;
  }

  _createClass(Chainer, [{
    key: 'chain',
    value: function chain(path, name, contextTree, fn) {
      var _this = this;

      if (typeof fn === 'undefined' || fn === null) {
        fn = function fn() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (!args.length) {
            throw new Error('BUG! must be called with at least one argument');
          }
          var separator = '/';
          // Special-case compare because its args turn into '...' instead of the usual '/'
          if (name === 'compare') {
            separator = '...';
          }
          return _this.chain(path + '/' + args.join(separator), name, contextTree);
        };
      }

      this._verbMethods.injectVerbMethods(path, fn);

      if (typeof fn === 'function' || (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object') {
        for (name in contextTree || {}) {
          (function (name) {
            // Delete the key if it already exists
            delete fn[plus.camelize(name)];

            return Object.defineProperty(fn, plus.camelize(name), {
              configurable: true,
              enumerable: true,
              get: function get() {
                return _this.chain(path + '/' + name, name, contextTree[name]);
              }
            });
          })(name);
        }
      }

      return fn;
    }
  }]);

  return Chainer;
}();
//# sourceMappingURL=chainer.js.map