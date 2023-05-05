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
    y: function() {
        return y;
    }
});
const _foo = /*#__PURE__*/ _interop_require_default(require("foo"));
const _bar = require("bar");
const _baz = /*#__PURE__*/ _interop_require_wildcard(require("baz"));
const _default = {
    foo: _foo.default,
    baz: _baz,
    baz: _baz
};
const x = {
    foo: _foo.default,
    bar: _bar.bar,
    baz: _baz
};
const y = {
    foo: _foo.default,
    bar: _bar.bar,
    baz: _baz
};
