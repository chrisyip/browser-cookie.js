(global => {
  var defaultOption = {},
      objectKeys, objectAssign, Cookie, previousCookie, escape, unescape, document;

  escape = global.escape;
  unescape = global.unescape;
  document = global.document;

  /**
   * Object.keys shim
   */
  objectKeys = object => {
    var index = -1,
        props = [],
        result = [],
        length;

    for (var key in object) {
      props.push(key);
    }

    length = props.length;

    while (++index < length) {
      var key = props[index];
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        result.push(key);
      }
    }
    return result;
  };

  /**
   * Object.assign shim, with `reduce` process
   */
  objectAssign = (...args) => {
    var object = args[0],
        source = args[1],
        guard = args[2];

    if (!object || args.length < 2) {
      return object;
    }

    var argsIndex = 0,
        argsLength = args.length,
        type = typeof guard;

    while (++argsIndex < argsLength) {
      source = args[argsIndex];
      var index = -1,
          props = objectKeys(source),
          length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
    }
    return object;
  };

  Cookie = {
    get: key => {
      if (Cookie.has(key)) {
        return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
      }
    },

    set: (key, value, opts) => {
      if (/^(?:expires|max\-age|path|domain|secure)$/.test(key)) {
        return;
      }

      var domain, expires, options, path, secure;

      options = objectAssign({}, defaultOption, opts);
      domain = (options.domain ? '; domain=' + options.domain : '');
      expires = options.expires;
      path = '; path=' + (options.path || '/');
      secure = (options.secure ? '; secure' : '');

      switch (typeof expires) {
        case 'number':
          expires = '; max-age=' + expires;
          break;
        case 'string':
          expires = '; expires=' + new Date(expires).toGMTString();
          break;
        case 'object':
          expires = ('toGMTString' in expires ? '; expires=' + expires.toGMTString() : '');
          break;
        default:
          expires = '';
      }

      document.cookie = escape(key) + '=' + escape(value) + expires + domain + path + secure;
    },

    remove: (key) => {
      if (key && Cookie.has(key)) {
        var expDate = new Date();
        expDate.setYear(expDate.getFullYear() - 99);
        Cookie.set(key, '', { expires: expDate });
      }
    },

    has: (key) => (new RegExp('(?:^|;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie),

    keys: () => {
      var arr = document.cookie.split('; '),
          list = [];

      for (var i = arr.length; i--; ) {
        list.unshift(arr[i].split('=')[0]);
      }

      return list;
    },

    setup: (options) => {
      objectAssign(defaultOption, options);
    },

    noConflict: () => {
      if (global.Cookie === Cookie) {
        global.Cookie = previousCookie;
      }

      return Cookie;
    }
  };

  // Backup global Cookie
  if (global.Cookie) {
    previousCookie = global.Cookie;
  }

  global.Cookie = Cookie;

  // Work with module loading scenarios
  if (typeof module === 'object' && typeof module.exports === 'object') {
    // CommonJS/Node.js
    var target = module.exports || exports;
    target = Cookie;
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define('Cookie', [], () => Cookie);
  }
})(new Function('return this')());
