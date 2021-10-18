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
var C = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(C2, C1);
    function C2() {
        _classCallCheck(this, C2);
        return _possibleConstructorReturn(this, _getPrototypeOf(C2).apply(this, arguments));
    }
    return C2;
} // error
(C);
var D = /*#__PURE__*/ function(D1) {
    "use strict";
    _inherits(D2, D1);
    function D2() {
        _classCallCheck(this, D2);
        return _possibleConstructorReturn(this, _getPrototypeOf(D2).apply(this, arguments));
    }
    return D2;
} // error
(D);
var E = /*#__PURE__*/ function(E1) {
    "use strict";
    _inherits(E2, E1);
    function E2() {
        _classCallCheck(this, E2);
        return _possibleConstructorReturn(this, _getPrototypeOf(E2).apply(this, arguments));
    }
    return E2;
} // error
(E);
