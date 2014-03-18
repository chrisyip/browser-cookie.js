global = @
defaultOption = {}
escape = global.escape
unescape = global.unescape
document = global.document

# Object.keys shim
objectKeys = (object) ->
  if 'keys' of Object
    Object.keys object
  else
    props = []
    result = []

    for key of object
      result.push key if Object.prototype.hasOwnProperty.call object, key

    result

# Object.assign shim, with `reduce` process
objectAssign = (args...) ->
  object = args[0]

  return object if not object and args.length < 2

  if 'assign' of Object
    for i in [1...args.length]
      Object.assign object, args[i]
  else
    for i in [1...args.length]
      source = args[i]
      props = objectKeys source

      for i in [0...props.length]
        key = props[i]
        object[key] = source[key]

  object

class Cookie
  get: (key) ->
    if key and @has key
      unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'))

  set: (key, value, opts) ->
    return if /^(?:expires|max\-age|path|domain|secure)$/.test key

    options = objectAssign {}, defaultOption, opts
    domain = if options.domain then '; domain=' + options.domain else ''
    expires = options.expires
    path = '; path=' + (options.path or '/')
    secure = if options.secure then ' secure' else ''

    switch typeof expires
      when 'number'
        expires = '; max-age=' + expires
      when 'string'
        expires = '; expires=' + new Date(expires).toGMTString()
      when 'object'
        expires = if 'toGMTString' of expires then '; expires=' + expires.toGMTString() else ''
      else
        expires = ''

    document.cookie = "#{escape(key)}=#{escape(value)}#{expires}#{domain}#{path}#{secure}"

    null

  remove: (key) ->
    if key and @has key
      expDate = new Date()
      expDate.setYear expDate.getFullYear() - 99
      @set key, '', expires: expDate

    null

  has: (key) ->
    (new RegExp('(?:^|;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test document.cookie

  keys: ->
    arr = document.cookie.split ' '
    list = []

    for i in [0...arr.length]
      list.push arr[i].split('=')[0]

    list

  setup: (options) ->
    objectAssign defaultOption, options
    null

  noConflict: ->
    global.Cookie = previousCookie if global.Cookie is @

    return @

# Backup global Cookie
previousCookie = global.Cookie if global.Cookie
global.Cookie = Cookie

# Work with module loading scenarios
if typeof module is 'object' and typeof module.exports is 'object'
  # CommonJS/Node.js
  target = module.exports or exports
  target = Cookie
else if typeof define is 'function' and define.amd
  # AMD
  define 'Cookie', [], -> Cookie

Cookie
