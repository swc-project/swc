"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    x: _,
    y: _,
    default: _
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    x: ()=>x,
    y: ()=>y,
    default: ()=>_default
});
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _foo = require("foo");
const _bar = /*#__PURE__*/ _interop_require_wildcard(require("bar"), true);
const x = {
    foo: _foo,
    bar: _bar.default
};
const y = _bar.baz;
const _default = {
    x,
    y
};
