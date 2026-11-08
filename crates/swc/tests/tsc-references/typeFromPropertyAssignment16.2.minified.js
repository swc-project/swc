//// [a.js]
var Outer = {};
Outer.Inner = function() {}, Outer.Inner.prototype = {
    x: 1,
    m: function() {}
}, (void 0).x, (void 0).m();
var inno = new Outer.Inner();
inno.x, inno.m();
