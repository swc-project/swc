//// [genericCallWithObjectTypeArgsAndConstraints5.ts]
var c, d;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
foo(d, c), foo(function() {
    return 1;
}, function() {});
