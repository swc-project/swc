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
var Base = function Base() {
    "use strict";
    _classCallCheck(this, Base);
};
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _createSuper(Derived1);
    function Derived1() {
        _classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    return Derived1;
}(Base);
var A1 = function A1() {
    "use strict";
    _classCallCheck(this, A1);
};
var B1 = function B1() {
    "use strict";
    _classCallCheck(this, B1);
};
var A2 = function A2() {
    "use strict";
    _classCallCheck(this, A2);
};
var B2 = /*#__PURE__*/ function(A2) {
    "use strict";
    _inherits(B2, A2);
    var _super = _createSuper(B2);
    function B2() {
        _classCallCheck(this, B2);
        return _super.apply(this, arguments);
    }
    return B2;
}(A2);
var a1;
var a2;
var b1;
var b2;
// operator <
var ra1 = a1 < b1;
var ra2 = a2 < b2;
var ra3 = b1 < a1;
var ra4 = b2 < a2;
// operator >
var rb1 = a1 > b1;
var rb2 = a2 > b2;
var rb3 = b1 > a1;
var rb4 = b2 > a2;
// operator <=
var rc1 = a1 <= b1;
var rc2 = a2 <= b2;
var rc3 = b1 <= a1;
var rc4 = b2 <= a2;
// operator >=
var rd1 = a1 >= b1;
var rd2 = a2 >= b2;
var rd3 = b1 >= a1;
var rd4 = b2 >= a2;
// operator ==
var re1 = a1 == b1;
var re2 = a2 == b2;
var re3 = b1 == a1;
var re4 = b2 == a2;
// operator !=
var rf1 = a1 != b1;
var rf2 = a2 != b2;
var rf3 = b1 != a1;
var rf4 = b2 != a2;
// operator ===
var rg1 = a1 === b1;
var rg2 = a2 === b2;
var rg3 = b1 === a1;
var rg4 = b2 === a2;
// operator !==
var rh1 = a1 !== b1;
var rh2 = a2 !== b2;
var rh3 = b1 !== a1;
var rh4 = b2 !== a2;
