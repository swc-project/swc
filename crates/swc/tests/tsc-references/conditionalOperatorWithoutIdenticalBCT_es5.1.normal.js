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
var X = function X() {
    "use strict";
    _classCallCheck(this, X);
};
var A = /*#__PURE__*/ function(X) {
    "use strict";
    _inherits(A, X);
    var _super = _createSuper(A);
    function A() {
        _classCallCheck(this, A);
        return _super.apply(this, arguments);
    }
    return A;
}(X);
var B = /*#__PURE__*/ function(X) {
    "use strict";
    _inherits(B, X);
    var _super = _createSuper(B);
    function B() {
        _classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(X);
var x;
var a;
var b;
// No errors anymore, uses union types
true ? a : b;
var result1 = true ? a : b;
//Be contextually typed and and bct is not identical, results in errors that union type is not assignable to target
var result2 = true ? a : b;
var result3 = true ? a : b;
var result31 = true ? a : b;
var result4 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
var result5 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
var result6 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
var result61 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
