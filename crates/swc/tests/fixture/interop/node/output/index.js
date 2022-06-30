"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.y = exports.x = exports.default = void 0;
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
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _foo = require("foo");
const _bar = _interopRequireWildcard(require("bar"), true);
const x = {
    foo: _foo,
    bar: _bar.default
};
const y = _bar.baz;
var _default = {
    x,
    y
};
