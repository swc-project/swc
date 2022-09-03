//// [functionExpressionContextualTyping1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(E) {
    E[E.red = 0] = "red", E[E.blue = 1] = "blue";
}(E || (E = {}));
var E, b1, b2, b3, b6, b7, a0 = function(num, str) {
    return num.toExponential(), 0;
}, Class = function() {
    "use strict";
    function Class() {
        _class_call_check(this, Class);
    }
    return Class.prototype.foo = function() {}, Class;
}(), a1 = function(a1) {
    return a1.foo(), 1;
};
b1 = function(k, h) {}, b2 = function(foo, bar) {
    return foo + 1;
}, b2 = function(foo, bar) {
    return "hello";
}, b3 = function(name, number) {};
var b4 = function() {
    return arguments.length > 0 && void 0 !== arguments[0] && arguments[0], "hello";
}, b5 = function() {
    return arguments.length > 0 && void 0 !== arguments[0] && arguments[0], "hello";
};
b6 = function(k) {
    k.toLowerCase();
}, b6 = function(i) {
    return i.toExponential(), i;
}, b7 = function(j, m) {};
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
