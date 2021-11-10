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
var a1;
var b1;
var a2;
var b2;
var a3;
var b3;
var a4;
var b4;
// operator <
var r1a1 = a1 < b1;
var r1a1 = a2 < b2;
var r1a1 = a3 < b3;
var r1a1 = a4 < b4;
var r1b1 = b1 < a1;
var r1b1 = b2 < a2;
var r1b1 = b3 < a3;
var r1b1 = b4 < a4;
// operator >
var r2a1 = a1 > b1;
var r2a1 = a2 > b2;
var r2a1 = a3 > b3;
var r2a1 = a4 > b4;
var r2b1 = b1 > a1;
var r2b1 = b2 > a2;
var r2b1 = b3 > a3;
var r2b1 = b4 > a4;
// operator <=
var r3a1 = a1 <= b1;
var r3a1 = a2 <= b2;
var r3a1 = a3 <= b3;
var r3a1 = a4 <= b4;
var r3b1 = b1 <= a1;
var r3b1 = b2 <= a2;
var r3b1 = b3 <= a3;
var r3b1 = b4 <= a4;
// operator >=
var r4a1 = a1 >= b1;
var r4a1 = a2 >= b2;
var r4a1 = a3 >= b3;
var r4a1 = a4 >= b4;
var r4b1 = b1 >= a1;
var r4b1 = b2 >= a2;
var r4b1 = b3 >= a3;
var r4b1 = b4 >= a4;
// operator ==
var r5a1 = a1 == b1;
var r5a1 = a2 == b2;
var r5a1 = a3 == b3;
var r5a1 = a4 == b4;
var r5b1 = b1 == a1;
var r5b1 = b2 == a2;
var r5b1 = b3 == a3;
var r5b1 = b4 == a4;
// operator !=
var r6a1 = a1 != b1;
var r6a1 = a2 != b2;
var r6a1 = a3 != b3;
var r6a1 = a4 != b4;
var r6b1 = b1 != a1;
var r6b1 = b2 != a2;
var r6b1 = b3 != a3;
var r6b1 = b4 != a4;
// operator ===
var r7a1 = a1 === b1;
var r7a1 = a2 === b2;
var r7a1 = a3 === b3;
var r7a1 = a4 === b4;
var r7b1 = b1 === a1;
var r7b1 = b2 === a2;
var r7b1 = b3 === a3;
var r7b1 = b4 === a4;
// operator !==
var r8a1 = a1 !== b1;
var r8a1 = a2 !== b2;
var r8a1 = a3 !== b3;
var r8a1 = a4 !== b4;
var r8b1 = b1 !== a1;
var r8b1 = b2 !== a2;
var r8b1 = b3 !== a3;
var r8b1 = b4 !== a4;
