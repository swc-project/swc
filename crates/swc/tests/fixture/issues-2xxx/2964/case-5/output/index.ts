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
const a = 1;
const b = 2;
const _ref = {
    a: 1,
    b: 2
}, {} = _ref, foo = _extends._({}, _ref);
