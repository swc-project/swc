//// [genericCallWithObjectTypeArgsAndConstraints5.ts]
import "@swc/helpers/_/_class_call_check";
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
foo(void 0, void 0), foo(function() {
    return 1;
}, function() {});
