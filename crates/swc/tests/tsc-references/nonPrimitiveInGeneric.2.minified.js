//// [nonPrimitiveInGeneric.ts]
function generic(t) {}
var a = {};
function bound(t) {}
function bound2() {}
generic({}), generic(a), generic(123), generic("42"), bound({}), bound(a), bound(123), bound("42"), bound2(), bound2(), bound2(), bound2();
