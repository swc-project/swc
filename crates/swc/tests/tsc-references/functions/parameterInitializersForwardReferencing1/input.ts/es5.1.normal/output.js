function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var foo4 = "";
function f1() {
    var bar = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : foo4;
    var foo1 = 2;
    return bar; // returns 1
}
function f2() {
    var bar = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        var baz = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : foo4;
        return baz;
    };
    var foo2 = 2;
    return bar(); // returns 1
}
function f3() {
    var bar = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : foo4, foo3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
    return bar;
}
function f4(foo) {
    var bar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : foo;
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
    var bar = param[foo4];
    var foo = 2;
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
