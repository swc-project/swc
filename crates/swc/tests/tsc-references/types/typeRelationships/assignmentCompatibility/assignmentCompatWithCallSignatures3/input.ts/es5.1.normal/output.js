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
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _createSuper(Derived2);
    function Derived2() {
        _classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Derived1);
var OtherDerived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(OtherDerived, Base);
    var _super = _createSuper(OtherDerived);
    function OtherDerived() {
        _classCallCheck(this, OtherDerived);
        return _super.apply(this, arguments);
    }
    return OtherDerived;
}(Base);
var a;
var a2;
var a3;
var a4;
var a5;
var a6;
var a7;
var a8;
var a9;
var a10;
var a11;
var a12;
var a13;
var a14;
var a15;
var a16;
var a17;
var a18;
var b;
a = b; // ok
b = a; // ok
var b2;
a2 = b2; // ok 
b2 = a2; // ok
var b3;
a3 = b3; // ok
b3 = a3; // ok
var b4;
a4 = b4; // ok
b4 = a4; // ok
var b5;
a5 = b5; // ok
b5 = a5; // ok
var b6;
a6 = b6; // ok
b6 = a6; // ok
var b7;
a7 = b7; // ok
b7 = a7; // ok
var b8;
a8 = b8; // ok
b8 = a8; // ok
var b9;
a9 = b9; // ok
b9 = a9; // ok
var b10;
a10 = b10; // ok
b10 = a10; // ok
var b11;
a11 = b11; // ok
b11 = a11; // ok
var b12;
a12 = b12; // ok
b12 = a12; // ok
var b13;
a13 = b13; // ok
b13 = a13; // ok
var b14;
a14 = b14; // ok
b14 = a14; // ok
var b15;
a15 = b15; // ok
b15 = a15; // ok
var b16;
a16 = b16; // ok
b16 = a16; // ok
var b17; // ok
a17 = b17; // ok
b17 = a17; // ok
var b18;
a18 = b18; // ok
b18 = a18; // ok
