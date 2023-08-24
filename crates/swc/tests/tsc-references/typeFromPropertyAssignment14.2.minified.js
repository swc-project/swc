//// [def.js]
//// [work.js]
Outer.Inner = function() {}, Outer.Inner.prototype = {
    x: 1,
    m: function() {}
};
//// [use.js]
/** @type {Outer.Inner} */ inner.x, inner.m();
var inner, inno = new Outer.Inner();
inno.x, inno.m();
