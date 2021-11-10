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
var Base = function Base(x) {
    "use strict";
    _classCallCheck(this, Base);
};
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(C, Base);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(Base);
var r = C;
var c = new C(); // error
var c2 = new C(1); // ok
var Base2 = function Base2(x) {
    "use strict";
    _classCallCheck(this, Base2);
};
var D = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(D, Base2);
    var _super = _createSuper(D);
    function D() {
        _classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(Base2);
var r2 = D;
var d = new D(); // error
var d2 = new D(1); // ok
var D2 = // specialized base class
/*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(D2, Base2);
    var _super = _createSuper(D2);
    function D2() {
        _classCallCheck(this, D2);
        return _super.apply(this, arguments);
    }
    return D2;
}(Base2);
var r3 = D2;
var d3 = new D(); // error
var d4 = new D(1); // ok
var D3 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(D3, Base2);
    var _super = _createSuper(D3);
    function D3() {
        _classCallCheck(this, D3);
        return _super.apply(this, arguments);
    }
    return D3;
}(Base2);
var r4 = D3;
var d5 = new D(); // error
var d6 = new D(1); // ok
