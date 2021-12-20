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
// checking assignment compatibility relations for function types.
var Errors;
(function(Errors) {
    var Base = function Base() {
        "use strict";
        _classCallCheck(this, Base);
    };
    var Derived = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(Derived, Base);
        var _super = _createSuper(Derived);
        function Derived() {
            _classCallCheck(this, Derived);
            return _super.apply(this, arguments);
        }
        return Derived;
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
    }(Derived);
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
    var WithNonGenericSignaturesInBaseType;
    (function(WithNonGenericSignaturesInBaseType) {
        // target type with non-generic call signatures
        var a2;
        var a7;
        var a8;
        var a10;
        var a11;
        var a12;
        var a14;
        var a15;
        var a16;
        var a17;
        var b2;
        a2 = b2; // ok
        b2 = a2; // ok
        var b7;
        a7 = b7; // ok
        b7 = a7; // ok
        var b8;
        a8 = b8; // error, type mismatch
        b8 = a8; // error
        var b10;
        a10 = b10; // ok
        b10 = a10; // ok
        var b11;
        a11 = b11; // ok
        b11 = a11; // ok
        var b12;
        a12 = b12; // ok
        b12 = a12; // ok
        var b15;
        a15 = b15; // ok
        b15 = a15; // ok
        var b15a;
        a15 = b15a; // ok
        b15a = a15; // ok
        var b16;
        a16 = b16; // error
        b16 = a16; // error
        var b17;
        a17 = b17; // error
        b17 = a17; // error
    })(WithNonGenericSignaturesInBaseType || (WithNonGenericSignaturesInBaseType = {
    }));
    var WithGenericSignaturesInBaseType;
    (function(WithGenericSignaturesInBaseType) {
        // target type has generic call signature
        var a2;
        var b2;
        a2 = b2; // ok
        b2 = a2; // ok
        // target type has generic call signature
        var a3;
        var b3;
        a3 = b3; // ok
        b3 = a3; // ok
    })(WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {
    }));
})(Errors || (Errors = {
}));
