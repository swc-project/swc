//// [undefinedIsSubtypeOfEverything.ts]
// undefined is a subtype of every other types, no errors expected below
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
function f() {}
(E1 = E || (E = {}))[E1.A = 0] = "A", f1 = f || (f = {}), bar = 1, Object.defineProperty(f1, "bar", {
    enumerable: !0,
    get: function() {
        return bar;
    },
    set: function(v) {
        bar = v;
    }
});
var E, E1, f1, bar, c, bar1, c1 = function c() {
    _class_call_check(this, c);
};
c = c1 || (c1 = {}), bar1 = 1, Object.defineProperty(c, "bar", {
    enumerable: !0,
    get: function() {
        return bar1;
    },
    set: function(v) {
        bar1 = v;
    }
});
