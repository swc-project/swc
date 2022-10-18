//// [genericCallWithObjectTypeArgsAndConstraints5.ts]
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
foo(void 0, void 0), foo(function() {
    return 1;
}, function() {});
