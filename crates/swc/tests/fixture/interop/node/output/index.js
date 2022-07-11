"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.y = exports.x = void 0;
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
