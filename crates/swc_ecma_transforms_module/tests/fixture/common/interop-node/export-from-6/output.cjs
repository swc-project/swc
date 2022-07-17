"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.bar = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    bar: ()=>_foo.bar,
    default: ()=>_foo.foo
});
const _foo = require("foo");
