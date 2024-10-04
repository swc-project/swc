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
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
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
