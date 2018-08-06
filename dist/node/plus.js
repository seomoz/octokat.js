'use strict';

// Both of these internal methods are really small/simple and we are only
// working with arrays anyway
var filter = require('lodash/_arrayFilter');
var forEach = require('lodash/_arrayEach');
var map = require('lodash/_arrayMap');

// require('underscore-plus')
var plus = {
  camelize: function camelize(string) {
    if (string) {
      return string.replace(/[_-]+(\w)/g, function (m) {
        return m[1].toUpperCase();
      });
    } else {
      return '';
    }
  },
  uncamelize: function uncamelize(string) {
    if (!string) {
      return '';
    }
    return string.replace(/([A-Z])+/g, function (match) {
      var letter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return '_' + letter.toLowerCase();
    });
  },
  dasherize: function dasherize(string) {
    if (!string) {
      return '';
    }

    string = string[0].toLowerCase() + string.slice(1);
    return string.replace(/([A-Z])|(_)/g, function (m, letter) {
      if (letter) {
        return '-' + letter.toLowerCase();
      } else {
        return '-';
      }
    });
  },


  // Just _.extend(target, source)
  extend: function extend(target, source) {
    if (source) {
      return Object.keys(source).map(function (key) {
        target[key] = source[key];
      });
    }
  },


  // Just _.forOwn(obj, iterator)
  forOwn: function forOwn(obj, iterator) {
    return Object.keys(obj).map(function (key) {
      return iterator(obj[key], key);
    });
  },


  filter: filter,
  forEach: forEach,
  map: map
};

module.exports = plus;
//# sourceMappingURL=plus.js.map