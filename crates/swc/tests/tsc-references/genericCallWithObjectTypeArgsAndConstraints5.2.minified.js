//// [genericCallWithObjectTypeArgsAndConstraints5.ts]
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
var r2 = foo(d, c), r9 = foo(function() {
    return 1;
}, function() {});
function other() {
    foo(c, d);
}
