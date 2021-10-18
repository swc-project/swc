function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
// Only equality operators are allowed with unknown
function f10(x) {
    x == 5;
    x !== 10;
    x >= 0; // Error
    x.foo; // Error
    x[10]; // Error
    x(); // Error
    x + 1; // Error
    x * 2; // Error
    -x; // Error
    +x; // Error
}
// No property accesses, element accesses, or function calls
function f11(x) {
    x.foo; // Error
    x[5]; // Error
    x(); // Error
    new x(); // Error
}
function f20(x) {
    if (typeof x === "string" || typeof x === "number") {
        x; // string | number
    }
    if (_instanceof(x, Error)) {
        x; // Error
    }
    if (isFunction(x)) {
        x; // Function
    }
}
// Anything is assignable to unknown
function f21(pAny, pNever, pT) {
    var x;
    x = 123;
    x = "hello";
    x = [
        1,
        2,
        3
    ];
    x = new Error();
    x = x;
    x = pAny;
    x = pNever;
    x = pT;
}
// unknown assignable only to itself and any
function f22(x) {
    var v1 = x;
    var v2 = x;
    var v3 = x; // Error
    var v4 = x; // Error
    var v5 = x; // Error
    var v6 = x; // Error
    var v7 = x; // Error
}
// Type parameter 'T extends unknown' not related to object
function f23(x) {
    var y = x; // Error
}
// Anything fresh but primitive assignable to { [x: string]: unknown }
function f24(x) {
    x = {
    };
    x = {
        a: 5
    };
    x = [
        1,
        2,
        3
    ]; // Error
    x = 123; // Error
}
// Locals of type unknown always considered initialized
function f25() {
    var x;
    var y = x;
}
// Spread of unknown causes result to be unknown
function f26(x, y, z) {
    var o1 = _objectSpread({
        a: 42
    }, x); // { a: number }
    var o2 = _objectSpread({
        a: 42
    }, x, y); // unknown
    var o3 = _objectSpread({
        a: 42
    }, x, y, z); // any
    var o4 = _objectSpread({
        a: 42
    }, z); // any
}
// Functions with unknown return type don't need return expressions
function f27() {
}
// Rest type cannot be created from unknown
function f28(x) {
    var a = _extends({
    }, x); // Error
}
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
// Type parameter with explicit 'unknown' constraint not assignable to '{}'
function f30(t, u) {
    var x = t;
    var y = u;
}
function oops(arg) {
    return arg; // Error
}
