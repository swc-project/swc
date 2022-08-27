//// [nonPrimitiveInGeneric.ts]
function generic(t) {
    var o = t; // expect error
}
var a = {};
var b = "42";
generic({});
generic(a);
generic(123); // expect error
generic(b); // expect error
function bound(t) {
    var o = t; // ok
}
bound({});
bound(a);
bound(123); // expect error
bound(b); // expect error
function bound2() {}
bound2();
bound2();
bound2(); // expect error
bound2(); // expect error
function bound3(t) {
    var o = t; // ok
}
var x; // error
var y; // ok
var z; // ok
var u; // ok
