//// [genericCallWithObjectTypeArgsAndConstraints4.ts]
import "@swc/helpers/_/_class_call_check";
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
foo(void 0, void 0), foo(void 0, void 0), foo(void 0, {
    x: '',
    foo: void 0
}), foo(null, null), foo({}, null), foo(null, {}), foo({}, {}), foo(function() {}, function() {}), foo(function() {}, function() {
    return 1;
});
