"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    bar: ()=>bar,
    foo1: ()=>foo,
    bar2: ()=>bar,
    foo: ()=>foo,
    default: ()=>bar
});
const foo = 1;
let bar = 2;
bar = 3;
