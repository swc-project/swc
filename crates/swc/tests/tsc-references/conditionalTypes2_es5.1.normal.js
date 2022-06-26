import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f1(a, b) {
    a = b;
    b = a; // Error
}
function f2(a, b) {
    a = b; // Error
    b = a;
}
function f3(a, b) {
    a = b; // Error
    b = a; // Error
}
// Extract<T, Function> is a T that is known to be a Function
function isFunction(value) {
    return typeof value === "function";
}
function getFunction(item) {
    if (isFunction(item)) {
        return item;
    }
    throw new Error();
}
function f10(x) {
    if (isFunction(x)) {
        var f = x;
        var t = x;
    }
}
function f11(x) {
    if (isFunction(x)) {
        x();
    }
}
function f12(x) {
    var f = getFunction(x); // () => string
    f();
}
function f20(x, y, z) {
    fooBar(x);
    fooBar(y);
    fooBar(z);
}
function f21(x, y, z) {
    fooBat(x); // Error
    fooBat(y); // Error
    fooBat(z); // Error
}
// Repros from #22860
var Opt = /*#__PURE__*/ function() {
    "use strict";
    function Opt() {
        _class_call_check(this, Opt);
    }
    var _proto = Opt.prototype;
    _proto.toVector = function toVector() {
        return undefined;
    };
    return Opt;
}();
var Vector = /*#__PURE__*/ function() {
    "use strict";
    function Vector() {
        _class_call_check(this, Vector);
    }
    var _proto = Vector.prototype;
    _proto.tail = function tail() {
        return undefined;
    };
    _proto.partition2 = function partition2(predicate) {
        return undefined;
    };
    return Vector;
}();
function foo(value) {
    if (isFunction(value)) {
        toString1(value);
        toString2(value);
    }
}
var w = {
    a: 4
};
exportCommand(save);
gg(ff);
