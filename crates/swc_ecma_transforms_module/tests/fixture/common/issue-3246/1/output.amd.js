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
            _bar.foo
        ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
});
