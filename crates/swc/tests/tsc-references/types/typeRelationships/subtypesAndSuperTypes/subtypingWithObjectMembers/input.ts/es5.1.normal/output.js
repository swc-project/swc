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
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B() {
        _classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
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
var A3 = function A3() {
    "use strict";
    _classCallCheck(this, A3);
};
var B3 = /*#__PURE__*/ function(A3) {
    "use strict";
    _inherits(B3, A3);
    var _super = _createSuper(B3);
    function B3() {
        _classCallCheck(this, B3);
        return _super.apply(this, arguments);
    }
    return B3;
}(A3);
var TwoLevels;
(function(TwoLevels) {
    var A = function A() {
        "use strict";
        _classCallCheck(this, A);
    };
    var B = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(B, A);
        var _super = _createSuper(B);
        function B() {
            _classCallCheck(this, B);
            return _super.apply(this, arguments);
        }
        return B;
    }(A);
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
    var A3 = function A3() {
        "use strict";
        _classCallCheck(this, A3);
    };
    var B3 = /*#__PURE__*/ function(A3) {
        "use strict";
        _inherits(B3, A3);
        var _super = _createSuper(B3);
        function B3() {
            _classCallCheck(this, B3);
            return _super.apply(this, arguments);
        }
        return B3;
    }(A3);
})(TwoLevels || (TwoLevels = {
}));
