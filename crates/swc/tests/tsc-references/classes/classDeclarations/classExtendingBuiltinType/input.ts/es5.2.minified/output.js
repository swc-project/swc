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
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
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
function _createSuper(Derived) {
    var hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
        } catch (e) {
            return !1;
        }
    }();
    return function() {
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    };
}
var C1 = function(Object) {
    "use strict";
    _inherits(C1, Object);
    var _super = _createSuper(C1);
    function C1() {
        return _classCallCheck(this, C1), _super.apply(this, arguments);
    }
    return C1;
}(_wrapNativeSuper(Object)), C2 = function(Function) {
    "use strict";
    _inherits(C2, Function);
    var _super = _createSuper(C2);
    function C2() {
        return _classCallCheck(this, C2), _super.apply(this, arguments);
    }
    return C2;
}(_wrapNativeSuper(Function)), C3 = function(String) {
    "use strict";
    _inherits(C3, String);
    var _super = _createSuper(C3);
    function C3() {
        return _classCallCheck(this, C3), _super.apply(this, arguments);
    }
    return C3;
}(_wrapNativeSuper(String)), C4 = function(Boolean) {
    "use strict";
    _inherits(C4, Boolean);
    var _super = _createSuper(C4);
    function C4() {
        return _classCallCheck(this, C4), _super.apply(this, arguments);
    }
    return C4;
}(_wrapNativeSuper(Boolean)), C5 = function(Number) {
    "use strict";
    _inherits(C5, Number);
    var _super = _createSuper(C5);
    function C5() {
        return _classCallCheck(this, C5), _super.apply(this, arguments);
    }
    return C5;
}(_wrapNativeSuper(Number)), C6 = function(Date) {
    "use strict";
    _inherits(C6, Date);
    var _super = _createSuper(C6);
    function C6() {
        return _classCallCheck(this, C6), _super.apply(this, arguments);
    }
    return C6;
}(_wrapNativeSuper(Date)), C7 = function(RegExp) {
    "use strict";
    _inherits(C7, RegExp);
    var _super = _createSuper(C7);
    function C7() {
        return _classCallCheck(this, C7), _super.apply(this, arguments);
    }
    return C7;
}(_wrapNativeSuper(RegExp)), C8 = function(Error) {
    "use strict";
    _inherits(C8, Error);
    var _super = _createSuper(C8);
    function C8() {
        return _classCallCheck(this, C8), _super.apply(this, arguments);
    }
    return C8;
}(_wrapNativeSuper(Error)), C9 = function(Array) {
    "use strict";
    _inherits(C9, Array);
    var _super = _createSuper(C9);
    function C9() {
        return _classCallCheck(this, C9), _super.apply(this, arguments);
    }
    return C9;
}(_wrapNativeSuper(Array)), C10 = function(Array) {
    "use strict";
    _inherits(C10, Array);
    var _super = _createSuper(C10);
    function C10() {
        return _classCallCheck(this, C10), _super.apply(this, arguments);
    }
    return C10;
}(_wrapNativeSuper(Array));
