function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function _construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _setPrototypeOf(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
}
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var C1 = /*#__PURE__*/ function(Object) {
    "use strict";
    _inherits(C1, Object);
    var _super = _createSuper(C1);
    function C1() {
        _classCallCheck(this, C1);
        return _super.apply(this, arguments);
    }
    return C1;
}(_wrapNativeSuper(Object));
var C2 = /*#__PURE__*/ function(Function) {
    "use strict";
    _inherits(C2, Function);
    var _super = _createSuper(C2);
    function C2() {
        _classCallCheck(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
}(_wrapNativeSuper(Function));
var C3 = /*#__PURE__*/ function(String) {
    "use strict";
    _inherits(C3, String);
    var _super = _createSuper(C3);
    function C3() {
        _classCallCheck(this, C3);
        return _super.apply(this, arguments);
    }
    return C3;
}(_wrapNativeSuper(String));
var C4 = /*#__PURE__*/ function(Boolean) {
    "use strict";
    _inherits(C4, Boolean);
    var _super = _createSuper(C4);
    function C4() {
        _classCallCheck(this, C4);
        return _super.apply(this, arguments);
    }
    return C4;
}(_wrapNativeSuper(Boolean));
var C5 = /*#__PURE__*/ function(Number) {
    "use strict";
    _inherits(C5, Number);
    var _super = _createSuper(C5);
    function C5() {
        _classCallCheck(this, C5);
        return _super.apply(this, arguments);
    }
    return C5;
}(_wrapNativeSuper(Number));
var C6 = /*#__PURE__*/ function(Date) {
    "use strict";
    _inherits(C6, Date);
    var _super = _createSuper(C6);
    function C6() {
        _classCallCheck(this, C6);
        return _super.apply(this, arguments);
    }
    return C6;
}(_wrapNativeSuper(Date));
var C7 = /*#__PURE__*/ function(RegExp) {
    "use strict";
    _inherits(C7, RegExp);
    var _super = _createSuper(C7);
    function C7() {
        _classCallCheck(this, C7);
        return _super.apply(this, arguments);
    }
    return C7;
}(_wrapNativeSuper(RegExp));
var C8 = /*#__PURE__*/ function(Error) {
    "use strict";
    _inherits(C8, Error);
    var _super = _createSuper(C8);
    function C8() {
        _classCallCheck(this, C8);
        return _super.apply(this, arguments);
    }
    return C8;
}(_wrapNativeSuper(Error));
var C9 = /*#__PURE__*/ function(Array) {
    "use strict";
    _inherits(C9, Array);
    var _super = _createSuper(C9);
    function C9() {
        _classCallCheck(this, C9);
        return _super.apply(this, arguments);
    }
    return C9;
}(_wrapNativeSuper(Array));
var C10 = /*#__PURE__*/ function(Array) {
    "use strict";
    _inherits(C10, Array);
    var _super = _createSuper(C10);
    function C10() {
        _classCallCheck(this, C10);
        return _super.apply(this, arguments);
    }
    return C10;
}(_wrapNativeSuper(Array));
