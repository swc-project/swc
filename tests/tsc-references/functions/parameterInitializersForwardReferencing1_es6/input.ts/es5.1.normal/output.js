function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @target: es2015
var foo4 = "";
function f1(param) {
    var bar = param === void 0 ? foo4 : param;
    var foo1 = 2;
    return bar; // returns 1
}
function f2(param1) {
    var bar = param1 === void 0 ? function(param) {
        var baz = param === void 0 ? foo4 : param;
        return baz;
    } : param1;
    var foo2 = 2;
    return bar(); // returns 1
}
function f3(param, param2) {
    var bar = param === void 0 ? foo4 : param, foo3 = param2 === void 0 ? 2 : param2;
    return bar;
}
function f4(foo, param) {
    var bar = param === void 0 ? foo : param;
    return bar;
}
function f5(param) {
    var a = param === void 0 ? a : param;
    return a;
}
function f6(param) {
    var async = param === void 0 ? async : param;
    return async;
}
function f7(param) {
    var bar = param[foo4];
    var foo = 2;
}
var Foo = function Foo(param, param3) {
    "use strict";
    var x = param === void 0 ? 12 : param, y = param3 === void 0 ? x : param3;
    _classCallCheck(this, Foo);
    this.x = x;
    this.y = y;
};
function f8(foo1, param) {
    var bar = param === void 0 ? foo1 : param;
}
