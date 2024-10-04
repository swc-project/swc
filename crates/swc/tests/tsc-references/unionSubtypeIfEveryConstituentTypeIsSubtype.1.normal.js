//// [unionSubtypeIfEveryConstituentTypeIsSubtype.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var e = /*#__PURE__*/ function(e) {
    e[e["e1"] = 0] = "e1";
    e[e["e2"] = 1] = "e2";
    return e;
}(e || {});
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
var E2 = /*#__PURE__*/ function(E2) {
    E2[E2["A"] = 0] = "A";
    return E2;
}(E2 || {});
function f() {}
(function(f) {
    f.bar = 1;
})(f || (f = {}));
var c = function c() {
    "use strict";
    _class_call_check(this, c);
};
(function(c) {
    c.bar = 1;
})(c || (c = {}));
