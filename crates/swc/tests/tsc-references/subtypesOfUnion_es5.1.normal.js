import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var E;
(function(E) {
    E[E["e1"] = 0] = "e1";
    E[E["e2"] = 1] = "e2";
})(E || (E = {}));
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
    var bar = f.bar = 1;
})(f || (f = {}));
var c = function c() {
    "use strict";
    _class_call_check(this, c);
};
(function(c) {
    var bar = c.bar = 1;
})(c || (c = {}));
