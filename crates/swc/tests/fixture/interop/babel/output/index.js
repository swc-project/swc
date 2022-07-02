"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: ()=>_default,
    x: ()=>x,
    y: ()=>y
});
const _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _foo = /*#__PURE__*/ _interopRequireDefault(require("foo"));
const _bar = /*#__PURE__*/ _interopRequireWildcard(require("bar"));
const x = {
    foo: _foo.default,
    bar: _bar.default
};
const y = _bar.baz;
var _default = {
    x,
    y
};
