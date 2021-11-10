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
var x1, C1 = function(undefined) {
    "use strict";
    _inherits(C1, undefined);
    var _super = _createSuper(C1);
    function C1() {
        return _classCallCheck(this, C1), _super.apply(this, arguments);
    }
    return C1;
}(void 0), C2 = function(_super) {
    "use strict";
    _inherits(C2, _super);
    var _super1 = _createSuper(C2);
    function C2() {
        return _classCallCheck(this, C2), _super1.apply(this, arguments);
    }
    return C2;
}(!0), C3 = function(_super) {
    "use strict";
    _inherits(C3, _super);
    var _super2 = _createSuper(C3);
    function C3() {
        return _classCallCheck(this, C3), _super2.apply(this, arguments);
    }
    return C3;
}(!1), C4 = function(_super) {
    "use strict";
    _inherits(C4, 42);
    var _super3 = _createSuper(C4);
    function C4() {
        return _classCallCheck(this, C4), _super3.apply(this, arguments);
    }
    return C4;
}(42), C5 = function(_super) {
    "use strict";
    _inherits(C5, "hello");
    var _super4 = _createSuper(C5);
    function C5() {
        return _classCallCheck(this, C5), _super4.apply(this, arguments);
    }
    return C5;
}("hello"), C6 = function(x) {
    "use strict";
    _inherits(C6, x);
    var _super = _createSuper(C6);
    function C6() {
        return _classCallCheck(this, C6), _super.apply(this, arguments);
    }
    return C6;
}(x1), C7 = function(foo) {
    "use strict";
    _inherits(C7, foo);
    var _super = _createSuper(C7);
    function C7() {
        return _classCallCheck(this, C7), _super.apply(this, arguments);
    }
    return C7;
}(function() {
    this.x = 1;
});
