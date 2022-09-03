//// [conditionalTypes2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f1(a, b) {}
function f2(a, b) {}
function f3(a, b) {}
function isFunction(value) {
    return "function" == typeof value;
}
function getFunction(item) {
    if (isFunction(item)) return item;
    throw Error();
}
function f10(x) {
    isFunction(x);
}
function f11(x) {
    isFunction(x) && x();
}
function f12(x) {
    getFunction(x)();
}
function f20(x, y, z) {
    fooBar(x), fooBar(y), fooBar(z);
}
function f21(x, y, z) {
    fooBat(x), fooBat(y), fooBat(z);
}
var Opt = function() {
    "use strict";
    function Opt() {
        _class_call_check(this, Opt);
    }
    return Opt.prototype.toVector = function() {}, Opt;
}(), Vector = function() {
    "use strict";
    function Vector() {
        _class_call_check(this, Vector);
    }
    var _proto = Vector.prototype;
    return _proto.tail = function() {}, _proto.partition2 = function(predicate) {}, Vector;
}();
function foo(value) {
    isFunction(value) && (toString1(value), toString2(value));
}
var w = {
    a: 4
};
exportCommand(save), gg(ff);
