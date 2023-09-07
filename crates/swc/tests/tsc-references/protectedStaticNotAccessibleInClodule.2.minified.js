//// [protectedStaticNotAccessibleInClodule.ts]
// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C, f, b, C1 = function C() {
    _class_call_check(this, C);
};
f = (C = C1 || (C1 = {})).foo, Object.defineProperty(C, "f", {
    enumerable: !0,
    get: function() {
        return f;
    },
    set: function(v) {
        f = v;
    }
}), b = C.bar, Object.defineProperty(C, "b", {
    enumerable: !0,
    get: function() {
        return b;
    },
    set: function(v) {
        b = v;
    }
});
