//// [a.js]
var inner, Outer = {};
Outer.Inner = function() {}, Outer.Inner.prototype = {
    x: 1,
    m: function() {}
}, inner.x, inner.m();
var inno = new Outer.Inner();
inno.x, inno.m();
