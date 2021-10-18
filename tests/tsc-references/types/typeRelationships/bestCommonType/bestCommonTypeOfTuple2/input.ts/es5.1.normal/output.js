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
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
var E = function E() {
    "use strict";
    _classCallCheck(this, E);
};
var F = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(F, C);
    function F() {
        _classCallCheck(this, F);
        return _possibleConstructorReturn(this, _getPrototypeOf(F).apply(this, arguments));
    }
    return F;
}(C);
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
    this.i = "foo";
};
var D1 = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(D1, C1);
    function D1() {
        _classCallCheck(this, D1);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(D1).apply(this, arguments));
        _this.i = "bar";
        return _this;
    }
    return D1;
}(C1);
var t1;
var t2;
var t3;
var t4;
var t5;
var e11 = t1[4]; // base
var e21 = t2[4]; // {}
var e31 = t3[4]; // C1
var e41 = t4[2]; // base1
var e51 = t5[2]; // {}
