function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @target: es2015
var foo = "";
function f1() {
    var bar = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : foo;
    var foo = 2;
    return bar; // returns 1
}
function f2() {
    var bar = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        var baz = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : foo;
        return baz;
    };
    var foo = 2;
    return bar(); // returns 1
}
function f3() {
    var bar = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : foo, foo1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
    return bar;
}
function f4(foo2) {
    var bar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : foo2;
    return bar;
}
function f5() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : a;
    return a;
}
function f6() {
    var async = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : async;
    return async;
}
function f7(param) {
    var bar = param[foo];
    var foo3 = 2;
}
var Foo = function Foo() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 12, y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    _classCallCheck(this, Foo);
    this.x = x;
    this.y = y;
};
function f8(foo1) {
    var bar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : foo1;
}
