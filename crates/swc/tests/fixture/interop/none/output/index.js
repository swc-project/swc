"use strict";
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
const _foo = require("foo");
const _bar = require("bar");
const x = {
    foo: _foo.default,
    bar: _bar.default
};
const y = _bar.baz;
const _default = {
    x,
    y
};
