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
var A = function A(x) {
    "use strict";
    _classCallCheck(this, A);
    this.x = x;
    this.x = 0;
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B(x) {
        _classCallCheck(this, B);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(B).call(this, x));
        // Fails, x is readonly
        _this.x = 1;
        return _this;
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    function C(x) {
        _classCallCheck(this, C);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(C).call(this, x));
        _this.x = x;
        _this.x = 1;
        return _this;
    }
    return C;
}(A);
var D = function D(x) {
    "use strict";
    _classCallCheck(this, D);
    this.x = x;
    this.x = 0;
};
var E = // Fails, can't redeclare readonly property
/*#__PURE__*/ function(D) {
    "use strict";
    _inherits(E, D);
    function E(x) {
        _classCallCheck(this, E);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(E).call(this, x));
        _this.x = x;
        _this.x = 1;
        return _this;
    }
    return E;
}(D);
