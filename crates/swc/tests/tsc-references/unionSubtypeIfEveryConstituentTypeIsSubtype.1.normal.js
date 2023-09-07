//// [unionSubtypeIfEveryConstituentTypeIsSubtype.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var e;
(function(e) {
    e[e["e1"] = 0] = "e1";
    e[e["e2"] = 1] = "e2";
})(e || (e = {}));
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
var E2;
(function(E2) {
    E2[E2["A"] = 0] = "A";
})(E2 || (E2 = {}));
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
