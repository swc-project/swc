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
    foo: ()=>foo,
    a: ()=>a,
    b: ()=>b
});
const _extends = require("@swc/helpers/lib/_extends.js").default;
const a = 1;
const b = 2;
var foo = _extends({}, {
    a: 1,
    b: 2
});
