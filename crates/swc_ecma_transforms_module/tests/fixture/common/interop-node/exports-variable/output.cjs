"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.foo9 = exports.foo8 = exports.foo7 = exports.foo6 = exports.foo5 = exports.foo4 = exports.foo3 = exports.foo2 = exports.foo = exports.bar = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    bar: ()=>bar,
    foo: ()=>foo,
    foo2: ()=>foo2,
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
