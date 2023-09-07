//// [anyAssignableToEveryType2.ts]
// any is not a subtype of any other types, but is assignable, all the below should work
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
function f() {}
(function(f) {
    var bar = 1;
    Object.defineProperty(f, "bar", {
        enumerable: true,
        get: function get() {
            return bar;
        },
        set: function set(v) {
            bar = v;
        }
    });
})(f || (f = {}));
var c = function c() {
    "use strict";
    _class_call_check(this, c);
};
(function(c) {
    var bar = 1;
    Object.defineProperty(c, "bar", {
        enumerable: true,
        get: function get() {
            return bar;
        },
        set: function set(v) {
            bar = v;
        }
    });
})(c || (c = {}));
