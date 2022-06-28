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
    y: ()=>y
});
const _foo = _interopRequireDefault(require("foo"));
const _bar = require("bar");
const _baz = _interopRequireWildcard(require("baz"));
var _default = {
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
