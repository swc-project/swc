import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// Generic call with constraints infering type parameter from object member properties
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
var c;
var d;
var r = foo(c, d);
var r2 = foo(d, c); // error because C does not extend D
var r3 = foo(c, {
    x: "",
    foo: c
});
var r4 = foo(null, null);
var r5 = foo({}, null);
var r6 = foo(null, {});
var r7 = foo({}, {});
var r8 = foo(function() {}, function() {});
var r9 = foo(function() {}, function() {
    return 1;
});
function other() {
    var r4 = foo(c, d);
    var r5 = foo(c, d); // error
}
