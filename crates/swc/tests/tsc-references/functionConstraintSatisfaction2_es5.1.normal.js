import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// satisfaction of a constraint to Function, all of these invocations are errors unless otherwise noted
function foo(x) {
    return x;
}
foo(1);
foo(function() {}, 1);
foo(1, function() {});
function foo2(x) {
    return x;
}
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var b;
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var b2;
var r = foo2(new Function());
var r2 = foo2(function(x) {
    return x;
});
var r6 = foo2(C);
var r7 = foo2(b);
var r8 = foo2(function(x) {
    return x;
}); // no error expected
var r11 = foo2(function(x, y) {
    return x;
});
var r13 = foo2(C2);
var r14 = foo2(b2);
var f2;
var r16 = foo2(f2);
function fff(x, y) {
    foo2(x);
    foo2(y);
}
