//// [assignAnyToEveryType.ts]
// all of these are valid
var E, M, E1, M1, foo;
import "@swc/helpers/_/_class_call_check";
(E1 = E || (E = {}))[E1.A = 0] = "A", M1 = M || (M = {}), foo = 1, Object.defineProperty(M1, "foo", {
    enumerable: !0,
    get: function() {
        return foo;
    },
    set: function(v) {
        foo = v;
    }
});
