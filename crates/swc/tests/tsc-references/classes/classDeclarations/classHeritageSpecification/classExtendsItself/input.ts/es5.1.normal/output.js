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
var C1 = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(C1, C);
    function C1() {
        _classCallCheck(this, C1);
        return _possibleConstructorReturn(this, _getPrototypeOf(C1).apply(this, arguments));
    }
    return C1;
} // error
(C1);
var D1 = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(D1, D);
    function D1() {
        _classCallCheck(this, D1);
        return _possibleConstructorReturn(this, _getPrototypeOf(D1).apply(this, arguments));
    }
    return D1;
} // error
(D1);
var E1 = /*#__PURE__*/ function(E) {
    "use strict";
    _inherits(E1, E);
    function E1() {
        _classCallCheck(this, E1);
        return _possibleConstructorReturn(this, _getPrototypeOf(E1).apply(this, arguments));
    }
    return E1;
} // error
(E1);
