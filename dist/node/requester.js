'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./plus'),
    filter = _require.filter,
    map = _require.map;

// Request Function
// ===============================
//
// Generates the actual HTTP requests to GitHub.
// Handles ETag caching, authentication headers, boolean requests, and paged results

// # Construct the request function.
// It contains all the auth credentials passed in to the client constructor

var EVENT_ID = 0; // counter for the emitter so it is easier to match up requests

module.exports = function () {
  function Requester(_instance) {
    var _clientOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var plugins = arguments[2];
    var fetchImpl = arguments[3];

    _classCallCheck(this, Requester);

    // Provide an option to override the default URL
    this._instance = _instance;
    this._clientOptions = _clientOptions;
    if (this._clientOptions.rootURL == null) {
      this._clientOptions.rootURL = 'https://api.github.com';
    }
    if (this._clientOptions.useETags == null) {
      this._clientOptions.useETags = true;
    }
    if (this._clientOptions.usePostInsteadOfPatch == null) {
      this._clientOptions.usePostInsteadOfPatch = false;
    }
    if (this._clientOptions.userAgent == null) {
      if (typeof window === 'undefined' || window === null) {
        // Set the `User-Agent` because it is required and NodeJS
        // does not send one by default.
        // See http://developer.github.com/v3/#user-agent-required
        this._clientOptions.userAgent = 'octokat.js';
      }
    }

    // These are updated whenever a request is made (optional)
    if (typeof this._clientOptions.emitter === 'function') {
      this._emit = this._clientOptions.emitter;
    }

    this._pluginMiddlewareAsync = map(filter(plugins, function (_ref) {
      var requestMiddlewareAsync = _ref.requestMiddlewareAsync;
      return requestMiddlewareAsync;
    }), function (plugin) {
      return plugin.requestMiddlewareAsync.bind(plugin);
    });
    this._plugins = plugins;
    this._fetchImpl = fetchImpl;
  }

  // HTTP Request Abstraction
  // =======
  //


  _createClass(Requester, [{
    key: 'request',
    value: function request(method, path, data) {
      var _this = this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { isRaw: false, isBase64: false, isBoolean: false, contentType: 'application/json' };
      var cb = arguments[4];

      if (typeof options === 'undefined' || options === null) {
        options = {};
      }
      if (options.isRaw == null) {
        options.isRaw = false;
      }
      if (options.isBase64 == null) {
        options.isBase64 = false;
      }
      if (options.isBoolean == null) {
        options.isBoolean = false;
      }
      if (options.contentType == null) {
        options.contentType = 'application/json';
      }

      // console.log method, path, data, options, typeof cb

      // Only prefix the path when it does not begin with http.
      // This is so pagination works (which provides absolute URLs).
      if (!/^http/.test(path)) {
        path = '' + this._clientOptions.rootURL + path;
      }

      var headers = {
        'Accept': this._clientOptions.acceptHeader || 'application/json'

        // Safari/Firefox do not like setting the user-agent header
      };if (this._clientOptions.userAgent) {
        headers['User-Agent'] = this._clientOptions.userAgent;
      }

      var acc = { method: method, path: path, headers: headers, options: options, clientOptions: this._clientOptions

        // To use async.waterfall we need to pass in the initial data (`acc`)
        // so we create an initial function that just takes a callback
      };var initial = Promise.resolve(acc);

      var prev = initial;
      this._pluginMiddlewareAsync.forEach(function (p) {
        prev = prev.then(p);
      });
      return prev.then(function (acc) {
        var _acc = acc;
        method = _acc.method;
        headers = _acc.headers;


        if (options.isRaw) {
          headers['Accept'] = 'application/vnd.github.raw';
        }

        var fetchArgs = {
          // Be sure to **not** blow the cache with a random number
          // (GitHub will respond with 5xx or CORS errors)
          method: method,
          headers: headers,
          body: !options.isRaw && data && JSON.stringify(data) || data
        };

        var eventId = ++EVENT_ID;
        __guardFunc__(_this._emit, function (f) {
          return f('start', eventId, { method: method, path: path, data: data, options: options });
        });

        return _this._fetchImpl(path, fetchArgs).then(function (response) {
          var jqXHR = response;

          // Fire listeners when the request completes or fails
          if (_this._emit) {
            if (response.headers.get('X-RateLimit-Limit')) {
              var rateLimit = parseFloat(response.headers.get('X-RateLimit-Limit'));
              var rateLimitRemaining = parseFloat(response.headers.get('X-RateLimit-Remaining'));
              var rateLimitReset = parseFloat(response.headers.get('X-RateLimit-Reset'));
              // Reset time is in seconds, not milliseconds
              // if rateLimitReset
              //   rateLimitReset = new Date(rateLimitReset * 1000)

              var emitterRate = {
                remaining: rateLimitRemaining,
                limit: rateLimit,
                reset: rateLimitReset
              };

              if (response.headers.get('X-OAuth-Scopes')) {
                emitterRate.scopes = response.headers.get('X-OAuth-Scopes').split(', ');
              }
            }
            _this._emit('end', eventId, { method: method, path: path, data: data, options: options }, response.status, emitterRate);
          }

          // Return the result and Base64 encode it if `options.isBase64` flag is set.

          // Respond with the redirect URL (for archive links)
          // TODO: implement a `followRedirects` plugin
          if (response.status === 302) {
            return response.headers.get('Location');
          } else if (options.isBoolean && response.status === 204) {
            // If the request is a boolean yes/no question GitHub will indicate
            // via the HTTP Status of 204 (No Content) or 404 instead of a 200.
            return true;
          } else if (options.isBoolean && response.status === 404) {
            return false;
            // } else if (options.isBoolean) {
            //   throw new Error(`Octokat Bug? got a response to a boolean question that was not 204 or 404.  ${fetchArgs.method} ${path} Status: ${response.status}`)
          } else if (response.status >= 200 && response.status < 300 || response.status === 304 || response.status === 302 || response.status === 0) {
            // If it was a boolean question and the server responded with 204 ignore.
            var dataPromise = void 0;

            // If the status was 304 then let the cache handler pick it up. leave data blank
            if (response.status === 304) {
              dataPromise = Promise.resolve(null);
            } else {
              // TODO: use a blob if we are expecting a binary

              var contentType = response.headers.get('content-type') || '';

              // Use .indexOf instead of .startsWith because PhantomJS does not support .startsWith
              if (contentType.indexOf('application/json') === 0) {
                dataPromise = response.json();
              } else {
                // Other contentTypes:
                // - 'text/plain'
                // - 'application/octocat-stream'
                // - 'application/vnd.github.raw'
                dataPromise = response.text();
              }
            }

            return dataPromise.then(function (data) {
              acc = {
                clientOptions: _this._clientOptions,
                plugins: _this._plugins,
                data: data,
                options: options,
                jqXHR: jqXHR, // for cacheHandler
                status: response.status, // cacheHandler changes this
                request: acc, // Include the request data for plugins like cacheHandler
                requester: _this, // for Hypermedia to generate verb methods
                instance: _this._instance // for Hypermedia to be able to call `.fromUrl`
              };
              return _this._instance._parseWithContextPromise('', acc);
            });
          } else {
            return response.text().then(function (text) {
              return Promise.reject(new Error(text + ' ' + fetchArgs.method + ' ' + path + ' Status: ' + response.status));
            });
          }
        });
      });
    }
  }]);

  return Requester;
}();

function __guardFunc__(func, transform) {
  return typeof func === 'function' ? transform(func) : undefined;
}
//# sourceMappingURL=requester.js.map