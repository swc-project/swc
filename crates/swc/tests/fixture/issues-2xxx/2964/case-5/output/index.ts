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
    a: ()=>a,
    b: ()=>b,
    foo: ()=>foo
});
const _extends = require("@swc/helpers/lib/_extends.js").default;
const _object_destructuring_empty = require("@swc/helpers/lib/_object_destructuring_empty.js").default;
const a = 1;
const b = 2;
var foo = _extends({}, _object_destructuring_empty({
    a: 1,
    b: 2
}));
