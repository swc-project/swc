define([
    "require"
], function(require) {
    "use strict";
    new Promise((resolve, reject)=>require([
            path
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
    new Promise((resolve, reject)=>require([
            getPath()
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
});
