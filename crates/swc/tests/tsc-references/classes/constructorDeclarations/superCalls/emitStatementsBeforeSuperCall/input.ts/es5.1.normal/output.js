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
var Sub = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Sub, Base);
    function Sub(p) {
        _classCallCheck(this, Sub);
        var _this;
        console.log('hi'); // should emit before super
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Sub).call(this));
        _this.p = p;
        _this.field = 0;
        return _this;
    }
    return Sub;
}(Base);
var Test = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Test, Base);
    function Test(p) {
        _classCallCheck(this, Test);
        var _this;
        1; // should emit before super
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Test).call(this));
        _this.p = p;
        _this.prop = 1;
        return _this;
    }
    return Test;
}(Base);
