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
}, A1 = function() {
    "use strict";
    _classCallCheck(this, A1);
}, B2 = function() {
    "use strict";
    _classCallCheck(this, B2), this.anon = (function(A) {
        function _class() {
            return _classCallCheck(this, _class), _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
        }
        return _inherits(_class, A), _class;
    })(A1);
}, K = function(_super) {
    "use strict";
    function K() {
        return _classCallCheck(this, K), _possibleConstructorReturn(this, _getPrototypeOf(K).apply(this, arguments));
    }
    return _inherits(K, _super), K;
}(function() {
    return (function(A) {
        "use strict";
        function _class() {
            return _classCallCheck(this, _class), _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
        }
        return _inherits(_class, A), _class;
    })(A1);
}()), C = function(_super) {
    "use strict";
    function C() {
        return _classCallCheck(this, C), _possibleConstructorReturn(this, _getPrototypeOf(C).apply(this, arguments));
    }
    return _inherits(C, _super), C;
}(new B2().anon), S = function(b3Number) {
    "use strict";
    function S() {
        return _classCallCheck(this, S), _possibleConstructorReturn(this, _getPrototypeOf(S).apply(this, arguments));
    }
    return _inherits(S, b3Number), S;
}(function() {
    return (function(A) {
        "use strict";
        function Inner() {
            return _classCallCheck(this, Inner), _possibleConstructorReturn(this, _getPrototypeOf(Inner).apply(this, arguments));
        }
        return _inherits(Inner, A), Inner;
    })(A1);
}()), c = new C(), k = new K(), s = new S();
c.genericVar = 12, k.genericVar = 12, s.genericVar = 12;
