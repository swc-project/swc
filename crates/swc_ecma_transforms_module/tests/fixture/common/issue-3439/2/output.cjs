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
    default: ()=>_default,
    bar: ()=>bar,
    foo1: ()=>foo,
    bar2: ()=>bar,
    foo: ()=>foo
});
const foo = 1;
let bar = 2;
var _default = bar;
bar = 3;
