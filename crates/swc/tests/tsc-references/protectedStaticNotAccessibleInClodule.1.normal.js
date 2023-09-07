//// [protectedStaticNotAccessibleInClodule.ts]
// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function(C) {
    var f = C.foo; // OK
    Object.defineProperty(C, "f", {
        enumerable: true,
        get: function get() {
            return f;
        },
        set: function set(v) {
            f = v;
        }
    });
    var b = C.bar; // error
    Object.defineProperty(C, "b", {
        enumerable: true,
        get: function get() {
            return b;
        },
        set: function set(v) {
            b = v;
        }
    });
})(C || (C = {}));
