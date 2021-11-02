function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _construct(Parent, args, Class) {
    return (_construct = !function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
            })), !0;
        } catch (e) {
            return !1;
        }
    }() ? function _construct(Parent, args, Class) {
        var a = [
            null
        ];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a), instance = new Constructor();
        return Class && _setPrototypeOf(instance, Class.prototype), instance;
    } : Reflect.construct).apply(null, arguments);
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: !0,
            configurable: !0
        }
    }), superClass && _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _wrapNativeSuper(Class) {
    var _cache = "function" == typeof Map ? new Map() : void 0;
    return _wrapNativeSuper = function _wrapNativeSuper(Class) {
        var fn;
        if (null === Class || (fn = Class, -1 === Function.toString.call(fn).indexOf("[native code]"))) return Class;
        if ("function" != typeof Class) throw new TypeError("Super expression must either be null or a function");
        if (void 0 !== _cache) {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }
        return Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), _setPrototypeOf(Wrapper, Class);
    }, _wrapNativeSuper(Class);
}
var C1 = function(Object) {
    "use strict";
    function C1() {
        return _classCallCheck(this, C1), _possibleConstructorReturn(this, _getPrototypeOf(C1).apply(this, arguments));
    }
    return _inherits(C1, Object), C1;
}(_wrapNativeSuper(Object)), C2 = function(Function) {
    "use strict";
    function C2() {
        return _classCallCheck(this, C2), _possibleConstructorReturn(this, _getPrototypeOf(C2).apply(this, arguments));
    }
    return _inherits(C2, Function), C2;
}(_wrapNativeSuper(Function)), C3 = function(String) {
    "use strict";
    function C3() {
        return _classCallCheck(this, C3), _possibleConstructorReturn(this, _getPrototypeOf(C3).apply(this, arguments));
    }
    return _inherits(C3, String), C3;
}(_wrapNativeSuper(String)), C4 = function(Boolean) {
    "use strict";
    function C4() {
        return _classCallCheck(this, C4), _possibleConstructorReturn(this, _getPrototypeOf(C4).apply(this, arguments));
    }
    return _inherits(C4, Boolean), C4;
}(_wrapNativeSuper(Boolean)), C5 = function(Number) {
    "use strict";
    function C5() {
        return _classCallCheck(this, C5), _possibleConstructorReturn(this, _getPrototypeOf(C5).apply(this, arguments));
    }
    return _inherits(C5, Number), C5;
}(_wrapNativeSuper(Number)), C6 = function(Date) {
    "use strict";
    function C6() {
        return _classCallCheck(this, C6), _possibleConstructorReturn(this, _getPrototypeOf(C6).apply(this, arguments));
    }
    return _inherits(C6, Date), C6;
}(_wrapNativeSuper(Date)), C7 = function(RegExp) {
    "use strict";
    function C7() {
        return _classCallCheck(this, C7), _possibleConstructorReturn(this, _getPrototypeOf(C7).apply(this, arguments));
    }
    return _inherits(C7, RegExp), C7;
}(_wrapNativeSuper(RegExp)), C8 = function(Error) {
    "use strict";
    function C8() {
        return _classCallCheck(this, C8), _possibleConstructorReturn(this, _getPrototypeOf(C8).apply(this, arguments));
    }
    return _inherits(C8, Error), C8;
}(_wrapNativeSuper(Error)), C9 = function(Array) {
    "use strict";
    function C9() {
        return _classCallCheck(this, C9), _possibleConstructorReturn(this, _getPrototypeOf(C9).apply(this, arguments));
    }
    return _inherits(C9, Array), C9;
}(_wrapNativeSuper(Array)), C10 = function(Array) {
    "use strict";
    function C10() {
        return _classCallCheck(this, C10), _possibleConstructorReturn(this, _getPrototypeOf(C10).apply(this, arguments));
    }
    return _inherits(C10, Array), C10;
}(_wrapNativeSuper(Array));
