'use strict';

var toQueryString = require('../helpers/querystring');

// new class SimpleVerbs
module.exports = {
  verbs: {
    fetch: function fetch(path, query) {
      return { method: 'GET', path: '' + path + toQueryString(query) };
    },
    read: function read(path, query) {
      return { method: 'GET', path: '' + path + toQueryString(query), options: { isRaw: true } };
    },
    remove: function remove(path, data) {
      return { method: 'DELETE', path: path, data: data, options: { isBoolean: true } };
    },
    create: function create(path, data, contentType) {
      if (contentType) {
        return { method: 'POST', path: path, data: data, options: { isRaw: true, contentType: contentType } };
      } else {
        return { method: 'POST', path: path, data: data };
      }
    },
    update: function update(path, data) {
      return { method: 'PATCH', path: path, data: data };
    },
    add: function add(path, data) {
      return { method: 'PUT', path: path, data: data, options: { isBoolean: true } };
    },
    contains: function contains(path) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return { method: 'GET', path: path + '/' + args.join('/'), options: { isBoolean: true } };
    }
  }
};
//# sourceMappingURL=simple-verbs.js.map