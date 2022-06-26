import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// satisfaction of a constraint to Function, no errors expected
function foo(x) {
    return x;
}
var i;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var a;
var b;
var c;
var r = foo(new Function());
var r1 = foo(function(x) {
    return x;
});
var r2 = foo(function(x) {
    return x;
});
var r3 = foo(function(x) {
    return x;
});
var r4 = foo(function(x) {
    return x;
});
var r5 = foo(i);
var r6 = foo(C);
var r7 = foo(b);
var r8 = foo(c);
var i2;
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var a2;
var b2;
var c2;
var r9 = foo(function(x) {
    return x;
});
var r10 = foo(function(x) {
    return x;
});
var r11 = foo(function(x) {
    return x;
});
var r12 = foo(function(x, y) {
    return x;
});
var r13 = foo(i2);
var r14 = foo(C2);
var r15 = foo(b2);
var r16 = foo(c2);
var f2;
var r17 = foo(f2);
function foo2(x, y) {
    foo(x);
    foo(y);
} //function foo2<T extends { (): void }, U extends T>(x: T, y: U) {
 //    foo(x);
 //    foo(y);
 //}
