// Enable run-time transpilation of es6/7 in node
require('babel-register');
require('babel-polyfill');

// Setup global for Node, webpack will set for browser
global.__DEV__ = process.env.NODE_ENV !== 'production';

require('./src/server');
