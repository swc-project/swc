"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    default: ()=>_default,
    x: ()=>x,
    y: ()=>y
});
const _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _foo = _interopRequireDefault(require("foo"));
const _bar = _interopRequireWildcard(require("bar"));
const x = {
    foo: _foo.default,
    bar: _bar.default
};
const y = _bar.baz;
var _default = {
    x,
    y
};
