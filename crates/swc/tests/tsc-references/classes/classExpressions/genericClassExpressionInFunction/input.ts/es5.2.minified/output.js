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
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
        } catch (e) {
            return !1;
        }
    }();
    return function() {
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    };
}
var A1 = function() {
    "use strict";
    _classCallCheck(this, A1);
}, B2 = function() {
    "use strict";
    _classCallCheck(this, B2), this.anon = (function(A) {
        _inherits(_class, A);
        var _super = _createSuper(_class);
        function _class() {
            return _classCallCheck(this, _class), _super.apply(this, arguments);
        }
        return _class;
    })(A1);
}, K = function(_super) {
    "use strict";
    _inherits(K, _super);
    var _super1 = _createSuper(K);
    function K() {
        return _classCallCheck(this, K), _super1.apply(this, arguments);
    }
    return K;
}(function() {
    return (function(A) {
        "use strict";
        _inherits(_class, A);
        var _super = _createSuper(_class);
        function _class() {
            return _classCallCheck(this, _class), _super.apply(this, arguments);
        }
        return _class;
    })(A1);
}()), C = function(_super) {
    "use strict";
    _inherits(C, _super);
    var _super2 = _createSuper(C);
    function C() {
        return _classCallCheck(this, C), _super2.apply(this, arguments);
    }
    return C;
}(new B2().anon), S = function(b3Number) {
    "use strict";
    _inherits(S, b3Number);
    var _super = _createSuper(S);
    function S() {
        return _classCallCheck(this, S), _super.apply(this, arguments);
    }
    return S;
}(function() {
    return (function(A) {
        "use strict";
        _inherits(Inner, A);
        var _super = _createSuper(Inner);
        function Inner() {
            return _classCallCheck(this, Inner), _super.apply(this, arguments);
        }
        return Inner;
    })(A1);
}()), c = new C(), k = new K(), s = new S();
c.genericVar = 12, k.genericVar = 12, s.genericVar = 12;
