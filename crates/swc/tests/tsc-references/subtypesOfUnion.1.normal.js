//// [subtypesOfUnion.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var E = /*#__PURE__*/ function(E) {
    E[E["e1"] = 0] = "e1";
    E[E["e2"] = 1] = "e2";
    return E;
}(E || {});
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
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
