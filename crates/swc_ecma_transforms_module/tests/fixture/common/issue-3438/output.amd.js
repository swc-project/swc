define([
    "require",
    "exports",
    "bar"
], function(require, exports, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    new Promise((resolve, reject)=>require([
            `world/${(0, _bar.foo)(baz)}.js`
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
});
