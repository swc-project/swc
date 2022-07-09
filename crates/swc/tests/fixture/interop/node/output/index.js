"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.y = exports.x = exports.default = void 0;
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
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _foo = require("foo");
const _bar = /*#__PURE__*/ _interopRequireWildcard(require("bar"), true);
const x = {
    foo: _foo,
    bar: _bar.default
};
const y = _bar.baz;
const _default = {
    x,
    y
};
