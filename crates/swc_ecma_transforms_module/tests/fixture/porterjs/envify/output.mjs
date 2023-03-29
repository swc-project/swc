porter.define([
    "./cjs/react.development.js",
    "./a.browser.js"
], function(require, exports, module) {
    'use strict';
    if (process.env.NODE_ENV === 'production') {} else {
        module.exports = require('./cjs/react.development.js');
    }
    if (process.env.NODE_ENV !== 'production') {
        module.exports = require('./cjs/react.development.js');
    }
    process.browser ? require('./a.browser.js') : undefined;
});
