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
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
function B1() {
    // class expression can use T
    return /*#__PURE__*/ (function(A) {
        "use strict";
        _inherits(_class, A);
        function _class() {
            _classCallCheck(this, _class);
            return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
        }
        return _class;
    })(A);
}
var B2 = function B2() {
    "use strict";
    _classCallCheck(this, B2);
    this.anon = /*#__PURE__*/ (function(A) {
        _inherits(_class, A);
        function _class() {
            _classCallCheck(this, _class);
            return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
        }
        return _class;
    })(A);
};
function B3() {
    return /*#__PURE__*/ (function(A) {
        "use strict";
        _inherits(Inner, A);
        function Inner() {
            _classCallCheck(this, Inner);
            return _possibleConstructorReturn(this, _getPrototypeOf(Inner).apply(this, arguments));
        }
        return Inner;
    })(A);
}
var K = // extends can call B
/*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(K, _super);
    function K() {
        _classCallCheck(this, K);
        return _possibleConstructorReturn(this, _getPrototypeOf(K).apply(this, arguments));
    }
    return K;
}(B1());
var C = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(C, _super);
    function C() {
        _classCallCheck(this, C);
        return _possibleConstructorReturn(this, _getPrototypeOf(C).apply(this, arguments));
    }
    return C;
}(new B2().anon);
var b3Number1 = B3();
var S = /*#__PURE__*/ function(b3Number) {
    "use strict";
    _inherits(S, b3Number);
    function S() {
        _classCallCheck(this, S);
        return _possibleConstructorReturn(this, _getPrototypeOf(S).apply(this, arguments));
    }
    return S;
}(b3Number1);
var c = new C();
var k = new K();
var s = new S();
c.genericVar = 12;
k.genericVar = 12;
s.genericVar = 12;
