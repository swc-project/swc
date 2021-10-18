function _assertThisInitialized(self) {
    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var A = function() {
    "use strict";
    _classCallCheck(this, A), _foo.set(this, {
        writable: !0,
        value: void 0
    }), _classPrivateFieldSet(this, _foo, 3);
}, _foo = new WeakMap(), B = function(A) {
    "use strict";
    function B() {
        var _this, self, call, obj;
        return _classCallCheck(this, B), self = this, _this = (call = _getPrototypeOf(B).call(this)) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : _assertThisInitialized(self), _foo1.set(_assertThisInitialized(_this), {
            writable: !0,
            value: void 0
        }), _classPrivateFieldSet(_assertThisInitialized(_this), _foo1, "some string"), _this;
    }
    return !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(B, A), B;
}(A), _foo1 = new WeakMap();
