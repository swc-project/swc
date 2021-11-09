function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: !0,
            configurable: !0
        }
    }), superClass && _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, D0 = function(Base) {
    "use strict";
    function D0() {
        return _classCallCheck(this, D0), _possibleConstructorReturn(this, _getPrototypeOf(D0).apply(this, arguments));
    }
    return _inherits(D0, Base), D0;
}(Base), D1 = function(_super) {
    "use strict";
    function D1() {
        var _this;
        return _classCallCheck(this, D1), (_this = _possibleConstructorReturn(this, _getPrototypeOf(D1).call(this, "abc", "def"))).x = "x", _this.y = "y", _this;
    }
    return _inherits(D1, _super), D1;
}(getBase()), D2 = function(_super) {
    "use strict";
    function D2() {
        var _this;
        return _classCallCheck(this, D2), _this = _possibleConstructorReturn(this, _getPrototypeOf(D2).call(this, 10)), _this = _possibleConstructorReturn(this, _getPrototypeOf(D2).call(this, 10, 20)), _this.x = 1, _this.y = 2, _this;
    }
    return _inherits(D2, _super), D2;
}(getBase()), D3 = function(_super) {
    "use strict";
    function D3() {
        var _this;
        return _classCallCheck(this, D3), (_this = _possibleConstructorReturn(this, _getPrototypeOf(D3).call(this, "abc", 42))).x = "x", _this.y = 2, _this;
    }
    return _inherits(D3, _super), D3;
}(getBase()), D4 = function(_super) {
    "use strict";
    function D4() {
        return _classCallCheck(this, D4), _possibleConstructorReturn(this, _getPrototypeOf(D4).apply(this, arguments));
    }
    return _inherits(D4, _super), D4;
}(getBase()), D5 = function(_super) {
    "use strict";
    function D5() {
        return _classCallCheck(this, D5), _possibleConstructorReturn(this, _getPrototypeOf(D5).apply(this, arguments));
    }
    return _inherits(D5, _super), D5;
}(getBadBase());
