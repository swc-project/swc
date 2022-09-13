"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    foo: _,
    foo2: _,
    bar: _,
    foo3: _,
    foo4: _,
    foo5: _,
    foo6: _,
    foo7: _,
    foo8: _,
    foo9: _
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    foo: ()=>foo,
    foo2: ()=>foo2,
    bar: ()=>bar,
    foo3: ()=>foo3,
    foo4: ()=>foo4,
    foo5: ()=>foo5,
    foo6: ()=>foo6,
    foo7: ()=>foo7,
    foo8: ()=>foo8,
    foo9: ()=>foo9
});
var foo = 1;
var foo2 = 1, bar = 2;
var foo3 = function() {};
var foo4;
let foo5 = 2;
let foo6;
const foo7 = 3;
function foo8() {}
class foo9 {
}
