"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    bar: ()=>_foo.bar,
    default: ()=>_foo.foo
});
const _foo = require("foo");
