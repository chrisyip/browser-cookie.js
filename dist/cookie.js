(function() {
  var Cookie, defaultOption, document, escape, global, objectAssign, objectKeys, previousCookie, target, unescape,
    __slice = [].slice;

  global = this;

  defaultOption = {};

  escape = global.escape;

  unescape = global.unescape;

  document = global.document;

  objectKeys = function(object) {
    var key, props, result;
    if ('keys' in Object) {
      return Object.keys(object);
    } else {
      props = [];
      result = [];
      for (key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }
  };

  objectAssign = function() {
    var args, i, key, object, props, source, _i, _j, _k, _ref, _ref1, _ref2;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    object = args[0];
    if (!object && args.length < 2) {
      return object;
    }
    if ('assign' in Object) {
      for (i = _i = 1, _ref = args.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        Object.assign(object, args[i]);
      }
    } else {
      for (i = _j = 1, _ref1 = args.length; 1 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        source = args[i];
        props = objectKeys(source);
        for (i = _k = 0, _ref2 = props.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
          key = props[i];
          object[key] = source[key];
        }
      }
    }
    return object;
  };

  Cookie = (function() {
    function Cookie() {}

    Cookie.prototype.get = function(key) {
      if (key && this.has(key)) {
        return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
      }
    };

    Cookie.prototype.set = function(key, value, opts) {
      var domain, expires, options, path, secure;
      if (/^(?:expires|max\-age|path|domain|secure)$/.test(key)) {
        return;
      }
      options = objectAssign({}, defaultOption, opts);
      domain = options.domain ? '; domain=' + options.domain : '';
      expires = options.expires;
      path = '; path=' + (options.path || '/');
      secure = options.secure ? ' secure' : '';
      switch (typeof expires) {
        case 'number':
          expires = '; max-age=' + expires;
          break;
        case 'string':
          expires = '; expires=' + new Date(expires).toGMTString();
          break;
        case 'object':
          expires = 'toGMTString' in expires ? '; expires=' + expires.toGMTString() : '';
          break;
        default:
          expires = '';
      }
      document.cookie = "" + (escape(key)) + "=" + (escape(value)) + expires + domain + path + secure;
      return null;
    };

    Cookie.prototype.remove = function(key) {
      var expDate;
      if (key && this.has(key)) {
        expDate = new Date();
        expDate.setYear(expDate.getFullYear() - 99);
        this.set(key, '', {
          expires: expDate
        });
      }
      return null;
    };

    Cookie.prototype.has = function(key) {
      return (new RegExp('(?:^|;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
    };

    Cookie.prototype.keys = function() {
      var arr, i, list, _i, _ref;
      arr = document.cookie.split(' ');
      list = [];
      for (i = _i = 0, _ref = arr.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        list.push(arr[i].split('=')[0]);
      }
      return list;
    };

    Cookie.prototype.setup = function(options) {
      objectAssign(defaultOption, options);
      return null;
    };

    Cookie.prototype.noConflict = function() {
      if (global.Cookie === this) {
        global.Cookie = previousCookie;
      }
      return this;
    };

    return Cookie;

  })();

  if (global.Cookie) {
    previousCookie = global.Cookie;
  }

  global.Cookie = Cookie;

  if (typeof module === 'object' && typeof module.exports === 'object') {
    target = module.exports || exports;
    target = Cookie;
  } else if (typeof define === 'function' && define.amd) {
    define('Cookie', [], function() {
      return Cookie;
    });
  }

  Cookie;

}).call(this);
