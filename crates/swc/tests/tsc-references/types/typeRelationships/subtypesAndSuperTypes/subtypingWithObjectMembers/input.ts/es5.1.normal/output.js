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
var Base = function Base() {
    "use strict";
    _classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _classCallCheck(this, Derived);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived).apply(this, arguments));
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    function Derived2() {
        _classCallCheck(this, Derived2);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived2).apply(this, arguments));
    }
    return Derived2;
}(Derived);
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _classCallCheck(this, B);
        return _possibleConstructorReturn(this, _getPrototypeOf(B).apply(this, arguments));
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
    function B2() {
        _classCallCheck(this, B2);
        return _possibleConstructorReturn(this, _getPrototypeOf(B2).apply(this, arguments));
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
    function B3() {
        _classCallCheck(this, B3);
        return _possibleConstructorReturn(this, _getPrototypeOf(B3).apply(this, arguments));
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
        function B() {
            _classCallCheck(this, B);
            return _possibleConstructorReturn(this, _getPrototypeOf(B).apply(this, arguments));
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
        function B2() {
            _classCallCheck(this, B2);
            return _possibleConstructorReturn(this, _getPrototypeOf(B2).apply(this, arguments));
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
        function B3() {
            _classCallCheck(this, B3);
            return _possibleConstructorReturn(this, _getPrototypeOf(B3).apply(this, arguments));
        }
        return B3;
    }(A3);
})(TwoLevels || (TwoLevels = {
}));
