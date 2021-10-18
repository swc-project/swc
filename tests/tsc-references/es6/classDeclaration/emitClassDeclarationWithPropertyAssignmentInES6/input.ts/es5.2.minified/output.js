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
}, C = function() {
    "use strict";
    _classCallCheck(this, C), this.x = "Hello world";
}, D = function() {
    "use strict";
    _classCallCheck(this, D), this.x = "Hello world", this.y = 10;
}, E = function(D) {
    "use strict";
    function E() {
        var _this;
        return _classCallCheck(this, E), _this = _possibleConstructorReturn(this, _getPrototypeOf(E).apply(this, arguments)), _this.z = !0, _this;
    }
    return _inherits(E, D), E;
}(D), F = function(D) {
    "use strict";
    function F() {
        var _this;
        return _classCallCheck(this, F), (_this = _possibleConstructorReturn(this, _getPrototypeOf(F).call(this))).z = !0, _this.j = "HI", _this;
    }
    return _inherits(F, D), F;
}(D);
