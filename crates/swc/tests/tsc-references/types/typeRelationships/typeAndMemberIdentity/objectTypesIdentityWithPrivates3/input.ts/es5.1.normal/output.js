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
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
var C2 = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(C2, C1);
    function C2() {
        _classCallCheck(this, C2);
        return _possibleConstructorReturn(this, _getPrototypeOf(C2).apply(this, arguments));
    }
    return C2;
}(C1);
var c1;
c1; // Should succeed (private x originates in the same declaration)
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
var C4 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(C4, C3);
    function C4() {
        _classCallCheck(this, C4);
        return _possibleConstructorReturn(this, _getPrototypeOf(C4).apply(this, arguments));
    }
    return C4;
}(C3);
var c3;
c3; // Should fail (private x originates in the same declaration, but different types)
