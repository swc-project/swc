"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.foo = exports.bar = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    bar: ()=>_foo.bar,
    foo: ()=>_foo.foo
});
const _foo = require("foo");
