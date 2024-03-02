//// [module.js]
var Outer = {};
Outer.Inner = function() {}, Outer.Inner.prototype = {
    m () {},
    i: 1
}, Outer.Inner.prototype.j = 2, Outer.Inner.prototype.k;
var inner = new Outer.Inner();
inner.m(), inner.i, inner.j, inner.k;
