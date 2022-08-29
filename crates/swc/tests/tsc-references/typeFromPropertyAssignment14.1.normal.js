//// [def.js]
var Outer = {};
//// [work.js]
Outer.Inner = function() {};
Outer.Inner.prototype = {
    x: 1,
    m: function m() {}
};
//// [use.js]
/** @type {Outer.Inner} */ var inner;
inner.x;
inner.m();
var inno = new Outer.Inner();
inno.x;
inno.m();
