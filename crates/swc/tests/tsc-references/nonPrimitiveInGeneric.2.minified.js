//// [nonPrimitiveInGeneric.ts]
function generic(t) {}
var x, y, z, u, a = {}, b = "42";
function bound(t) {}
function bound2() {}
function bound3(t) {}
generic({}), generic(a), generic(123), generic(b), bound({}), bound(a), bound(123), bound(b), bound2(), bound2(), bound2(), bound2();
