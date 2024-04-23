//// [types.d.ts]
//// [mod.js]
/// <reference path='./types.d.ts'/>
var A = function A() {
    this.a = 1;
};
var B = function B() {
    this.b = 2;
};
exports.A = A;
exports.B = B;
A.prototype = B.prototype = {
    /** @param {number} n */ m: function m(n) {
        return n + 1;
    }
};
//// [use.js]
/// <reference path='./types.d.ts'/>
var mod = require('./mod');
var a = new mod.A();
var b = new mod.B();
a.m('nope');
b.m('not really');
