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
    default: function() {
        return _default;
    },
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _foo = /*#__PURE__*/ _interop_require_default._(require("foo"));
const _bar = /*#__PURE__*/ _interop_require_wildcard._(require("bar"));
const x = {
    foo: _foo.default,
    bar: _bar.default
};
const y = _bar.baz;
const _default = {
    x,
    y
};
