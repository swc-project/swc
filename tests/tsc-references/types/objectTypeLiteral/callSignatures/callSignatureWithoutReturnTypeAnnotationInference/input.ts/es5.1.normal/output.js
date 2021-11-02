function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
// @allowUnreachableCode: true
// Call signatures without a return type should infer one from the function body (if present)
// Simple types
function foo(x) {
    return 1;
}
var r = foo(1);
function foo2(x) {
    return foo(x);
}
var r2 = foo2(1);
function foo3() {
    return foo3();
}
var r3 = foo3();
function foo4(x) {
    return x;
}
var r4 = foo4(1);
function foo5(x) {
    if (true) {
        return 1;
    } else {
        return 2;
    }
}
var r5 = foo5(1);
function foo6(x) {
    try {
    } catch (e) {
        return [];
    } finally{
        return [];
    }
}
var r6 = foo6(1);
function foo7(x) {
    return typeof x === "undefined" ? "undefined" : _typeof(x);
}
var r7 = foo7(1);
// object types
function foo8(x) {
    return {
        x: x
    };
}
var r8 = foo8(1);
function foo9(x) {
    var i;
    return i;
}
var r9 = foo9(1);
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
function foo10(x) {
    var c;
    return c;
}
var r10 = foo10(1);
var M1;
(function(M) {
    M.x = 1;
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    M.C = C;
})(M1 || (M1 = {
}));
function foo11() {
    return M1;
}
var r11 = foo11();
function foo12() {
    var i2;
    return i2;
}
var r12 = foo12();
function m11() {
    return 1;
}
(function(m1) {
    m1.y = 2;
})(m11 || (m11 = {
}));
function foo13() {
    return m11;
}
var r13 = foo13();
var c1 = function c1(x) {
    "use strict";
    _classCallCheck(this, c1);
};
(function(c1) {
    c1.x = 1;
})(c1 || (c1 = {
}));
function foo14() {
    return c1;
}
var r14 = foo14();
var e11;
(function(e1) {
    e1[e1["A"] = 0] = "A";
})(e11 || (e11 = {
}));
(function(e1) {
    e1.y = 1;
})(e11 || (e11 = {
}));
function foo15() {
    return e11;
}
var r15 = foo15();
