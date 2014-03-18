# cookie.js

Access browser's cookies easier.

# How to use

```js
// change default settings
Cookie.setup({
  domain: 'mydomain.com', // current domain, default
  path: '/path/to/store', // `/`, by default
  expires: 3600, // accept string, number and date object
  secure: true // `false`, by default
});

Cookie.set('name', 'John Doe', {
  expires: '2015-1-1'
});

Cookie.get('name'); // `John Doe`;

Cookie.set('lang', 'JavaScript');

Cookie.keys(); // `['name', 'lang']`

Cookie.has('gender'); // `false`

Cookie.remove('lang');

Cookie.keys(); // `['name']`

Cookie.noConflict();
```

# Gulp task

`build` (alias `default`): compile ES6 script to ES5 with [gulp-traceur](https://github.com/sindresorhus/gulp-traceur).

`watch`: help developing script.

# To-do

- JSHint
- Jasmine
- Testing with connect
