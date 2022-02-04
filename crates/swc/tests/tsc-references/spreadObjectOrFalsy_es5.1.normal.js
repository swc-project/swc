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
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
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
// @strict: true
// @declaration: true
function f1(a) {
    return _objectSpread({}, a); // Error
}
function f2(a) {
    return _objectSpread({}, a);
}
function f3(a) {
    return _objectSpread({}, a); // Error
}
function f4(a) {
    return _objectSpread({}, a);
}
function f5(a) {
    return _objectSpread({}, a);
}
function f6(a) {
    return _objectSpread({}, a);
}
// Repro from #46976
function g1(a) {
    var z = a.z;
    return _objectSpread({}, z);
}
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
    }
    _createClass(Foo, [
        {
            key: "bar",
            value: function bar() {
                if (this.hasData()) {
                    this.data.toLocaleLowerCase();
                }
            }
        },
        {
            key: "hasData",
            value: function hasData() {
                return true;
            }
        }
    ]);
    return Foo;
}();
