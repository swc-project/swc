//// [anyAssignableToEveryType2.ts]
// any is not a subtype of any other types, but is assignable, all the below should work
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {}
(E = E1 || (E1 = {}))[E.A = 0] = "A", f1 = f || (f = {}), bar1 = 1, Object.defineProperty(f1, "bar", {
    enumerable: !0,
    get: function() {
        return bar1;
    },
    set: function(v) {
        bar1 = v;
    }
});
var c, bar, E, f1, bar1, E1, c1 = function c() {
    _class_call_check(this, c);
};
c = c1 || (c1 = {}), bar = 1, Object.defineProperty(c, "bar", {
    enumerable: !0,
    get: function() {
        return bar;
    },
    set: function(v) {
        bar = v;
    }
});
