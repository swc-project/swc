//// [genericCallWithObjectTypeArgsAndConstraints4.ts]
var c, d;
import "@swc/helpers/_/_class_call_check";
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
foo(c, d), foo(d, c), foo(c, {
    x: '',
    foo: c
}), foo(null, null), foo({}, null), foo(null, {}), foo({}, {}), foo(function() {}, function() {}), foo(function() {}, function() {
    return 1;
});
