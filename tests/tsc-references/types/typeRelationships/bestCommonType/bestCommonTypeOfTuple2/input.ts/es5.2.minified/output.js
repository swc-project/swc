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
var t1, t2, t3, t4, t5, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, C = function() {
    "use strict";
    _classCallCheck(this, C);
}, D = function() {
    "use strict";
    _classCallCheck(this, D);
}, E = function() {
    "use strict";
    _classCallCheck(this, E);
}, F = function(C) {
    "use strict";
    function F() {
        return _classCallCheck(this, F), _possibleConstructorReturn(this, _getPrototypeOf(F).apply(this, arguments));
    }
    return _inherits(F, C), F;
}(C), C1 = function() {
    "use strict";
    _classCallCheck(this, C1), this.i = "foo";
}, D1 = function(C1) {
    "use strict";
    function D1() {
        var _this;
        return _classCallCheck(this, D1), _this = _possibleConstructorReturn(this, _getPrototypeOf(D1).apply(this, arguments)), _this.i = "bar", _this;
    }
    return _inherits(D1, C1), D1;
}(C1);
t1[4], t2[4], t3[4], t4[2], t5[2];
