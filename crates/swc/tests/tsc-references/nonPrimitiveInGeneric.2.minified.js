//// [nonPrimitiveInGeneric.ts]
function generic(t) {}
var a = {};
generic({});
generic(a);
generic(123);
generic("42");
function bound(t) {}
bound({});
bound(a);
bound(123);
bound("42");
function bound2() {}
bound2();
bound2();
bound2();
bound2();
