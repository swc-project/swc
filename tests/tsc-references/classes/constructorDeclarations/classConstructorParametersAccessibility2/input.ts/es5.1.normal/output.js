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
var C1 = function C1(x) {
    "use strict";
    _classCallCheck(this, C1);
    this.x = x;
};
var c1;
c1.x // OK
;
var C2 = function C2(p) {
    "use strict";
    _classCallCheck(this, C2);
    this.p = p;
};
var c2;
c2.p // private, error
;
var C3 = function C3(p) {
    "use strict";
    _classCallCheck(this, C3);
    this.p = p;
};
var c3;
c3.p // protected, error
;
var Derived = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(Derived, C3);
    function Derived(p) {
        _classCallCheck(this, Derived);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Derived).call(this, p));
        _this.p; // OK
        return _this;
    }
    return Derived;
}(C3);
