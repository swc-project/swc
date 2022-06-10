import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
(function(f1) {
    var bar = f1.bar = 1;
})(f || (f = {}));
var c = function c() {
    "use strict";
    _class_call_check(this, c);
};
(function(c) {
    var bar = c.bar = 1;
})(c || (c = {}));
