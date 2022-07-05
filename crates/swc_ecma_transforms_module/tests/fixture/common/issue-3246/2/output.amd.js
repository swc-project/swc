define([
    "require",
    "exports",
    "bar"
], function(require, exports, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _bar = /*#__PURE__*/ _interopRequireDefault(_bar);
    new Promise((resolve, reject)=>require([
            _bar.default
        ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
});
