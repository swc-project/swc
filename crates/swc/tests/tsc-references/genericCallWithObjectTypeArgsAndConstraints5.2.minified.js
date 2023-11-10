//// [genericCallWithObjectTypeArgsAndConstraints5.ts]
var c, d;
import "@swc/helpers/_/_class_call_check";
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
foo(d, c), foo(function() {
    return 1;
}, function() {});
