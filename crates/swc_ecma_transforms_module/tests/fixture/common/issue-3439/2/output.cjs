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
    bar: ()=>bar,
    foo1: ()=>foo,
    bar2: ()=>bar,
    foo: ()=>foo,
    default: ()=>_default
});
const foo = 1;
let bar = 2;
const _default = bar;
bar = 3;
