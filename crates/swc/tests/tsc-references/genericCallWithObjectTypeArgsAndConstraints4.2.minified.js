//// [genericCallWithObjectTypeArgsAndConstraints4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var c, d, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
var r = foo(c, d), r2 = foo(d, c), r3 = foo(c, {
    x: "",
    foo: c
}), r4 = foo(null, null), r5 = foo({}, null), r6 = foo(null, {}), r7 = foo({}, {}), r8 = foo(function() {}, function() {}), r9 = foo(function() {}, function() {
    return 1;
});
function other() {
    foo(c, d), foo(c, d);
}
