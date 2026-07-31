define([
    "require"
], function(require) {
    "use strict";
    new Promise((resolve, reject)=>require([
            "./data.json"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
    new Promise((resolve, reject)=>require([
            "./config.json"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
});
