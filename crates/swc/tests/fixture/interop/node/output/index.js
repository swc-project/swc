"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    x: null,
    y: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get default () {
        return _default;
    },
    get x () {
        return x;
    },
    get y () {
        return y;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _foo = require("foo");
const _bar = /*#__PURE__*/ _interop_require_wildcard._(require("bar"), true);
const x = {
    foo: _foo,
    bar: _bar.default
};
const y = _bar.baz;
const _default = {
    x,
    y
};
