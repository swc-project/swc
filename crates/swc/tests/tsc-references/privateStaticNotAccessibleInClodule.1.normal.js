//// [privateStaticNotAccessibleInClodule.ts]
// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function(C) {
    var y = C.bar; // error
    Object.defineProperty(C, "y", {
        enumerable: true,
        get: function get() {
            return y;
        },
        set: function set(v) {
            y = v;
        }
    });
})(C || (C = {}));
