function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
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
var Opt = // Repros from #22860
/*#__PURE__*/ function() {
    "use strict";
    function Opt() {
        _classCallCheck(this, Opt);
    }
    _createClass(Opt, [
        {
            key: "toVector",
            value: function toVector() {
                return undefined;
            }
        }
    ]);
    return Opt;
}();
var Vector = /*#__PURE__*/ function() {
    "use strict";
    function Vector() {
        _classCallCheck(this, Vector);
    }
    _createClass(Vector, [
        {
            key: "tail",
            value: function tail() {
                return undefined;
            }
        },
        {
            key: "partition2",
            value: function partition2(predicate) {
                return undefined;
            }
        }
    ]);
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
