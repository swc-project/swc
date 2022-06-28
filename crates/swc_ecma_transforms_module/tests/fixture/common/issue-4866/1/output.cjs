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
    a: ()=>a,
    b: ()=>b
});
let a, b;
console.log([a, b] = [
    1,
    2
]);
