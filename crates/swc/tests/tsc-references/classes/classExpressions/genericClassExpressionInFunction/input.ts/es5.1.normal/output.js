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
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
function B1() {
    // class expression can use T
    return /*#__PURE__*/ (function(A) {
        "use strict";
        _inherits(_class, A);
        var _super = _createSuper(_class);
        function _class() {
            _classCallCheck(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    })(A);
}
var B2 = function B2() {
    "use strict";
    _classCallCheck(this, B2);
    this.anon = /*#__PURE__*/ (function(A) {
        _inherits(_class, A);
        var _super = _createSuper(_class);
        function _class() {
            _classCallCheck(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    })(A);
};
function B3() {
    return /*#__PURE__*/ (function(A) {
        "use strict";
        _inherits(Inner, A);
        var _super = _createSuper(Inner);
        function Inner() {
            _classCallCheck(this, Inner);
            return _super.apply(this, arguments);
        }
        return Inner;
    })(A);
}
var K = // extends can call B
/*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(K, _super);
    var _super1 = _createSuper(K);
    function K() {
        _classCallCheck(this, K);
        return _super1.apply(this, arguments);
    }
    return K;
}(B1());
var C = /*#__PURE__*/ function(_super) {
    "use strict";
    _inherits(C, _super);
    var _super2 = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super2.apply(this, arguments);
    }
    return C;
}(new B2().anon);
var b3Number1 = B3();
var S = /*#__PURE__*/ function(b3Number) {
    "use strict";
    _inherits(S, b3Number);
    var _super = _createSuper(S);
    function S() {
        _classCallCheck(this, S);
        return _super.apply(this, arguments);
    }
    return S;
}(b3Number1);
var c = new C();
var k = new K();
var s = new S();
c.genericVar = 12;
k.genericVar = 12;
s.genericVar = 12;
