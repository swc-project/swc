"use strict";
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
const _foo = require("foo");
const _bar = require("bar");
const x = {
    foo: _foo.default,
    bar: _bar.default
};
const y = _bar.baz;
var _default = {
    x,
    y
};
