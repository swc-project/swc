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
var x1;
function foo1() {
    this.x = 1;
}
var C1 = /*#__PURE__*/ function(undefined) {
    "use strict";
    _inherits(C1, undefined);
    var _super = _createSuper(C1);
    function C1() {
        _classCallCheck(this, C1);
        return _super.apply(this, arguments);
    }
    return C1;
}(undefined);
var C2 = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(C2, _super);
    var _super1 = _createSuper(C2);
    function C2() {
        _classCallCheck(this, C2);
        return _super1.apply(this, arguments);
    }
    return C2;
}(true);
var C3 = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(C3, _super);
    var _super2 = _createSuper(C3);
    function C3() {
        _classCallCheck(this, C3);
        return _super2.apply(this, arguments);
    }
    return C3;
}(false);
var C4 = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(C4, _super);
    var _super3 = _createSuper(C4);
    function C4() {
        _classCallCheck(this, C4);
        return _super3.apply(this, arguments);
    }
    return C4;
}(42);
var C5 = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(C5, _super);
    var _super4 = _createSuper(C5);
    function C5() {
        _classCallCheck(this, C5);
        return _super4.apply(this, arguments);
    }
    return C5;
}("hello");
var C6 = /*#__PURE__*/ function(x) {
    "use strict";
    _inherits(C6, x);
    var _super = _createSuper(C6);
    function C6() {
        _classCallCheck(this, C6);
        return _super.apply(this, arguments);
    }
    return C6;
}(x1);
var C7 = /*#__PURE__*/ function(foo) {
    "use strict";
    _inherits(C7, foo);
    var _super = _createSuper(C7);
    function C7() {
        _classCallCheck(this, C7);
        return _super.apply(this, arguments);
    }
    return C7;
}(foo1);
