"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get a () {
        return a;
    },
    get b () {
        return b;
    },
    get foo () {
        return foo;
    }
});
const _extends = require("@swc/helpers/_/_extends");
const _object_destructuring_empty = require("@swc/helpers/_/_object_destructuring_empty");
const a = 1;
const b = 2;
var foo = _extends._({}, _object_destructuring_empty._({
    a: 1,
    b: 2
}));
