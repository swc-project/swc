"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    },
    default: function() {
        return _default;
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
