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
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
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
var Generics, A = function() {
    "use strict";
    _classCallCheck(this, A);
}, B = function(A1) {
    "use strict";
    _inherits(B, A1);
    var _super = _createSuper(B);
    function B() {
        return _classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B;
}(A), B2 = function(A2) {
    "use strict";
    _inherits(B2, A2);
    var _super = _createSuper(B2);
    function B2() {
        return _classCallCheck(this, B2), _super.apply(this, arguments);
    }
    return B2;
}(A);
!function(Generics) {
    var A3 = function() {
        "use strict";
        _classCallCheck(this, A3);
    }, B = function(A4) {
        "use strict";
        _inherits(B, A4);
        var _super = _createSuper(B);
        function B() {
            return _classCallCheck(this, B), _super.apply(this, arguments);
        }
        return B;
    }(A3), B2 = function(A5) {
        "use strict";
        _inherits(B2, A5);
        var _super = _createSuper(B2);
        function B2() {
            return _classCallCheck(this, B2), _super.apply(this, arguments);
        }
        return B2;
    }(A3), B3 = function(A6) {
        "use strict";
        _inherits(B3, A6);
        var _super = _createSuper(B3);
        function B3() {
            return _classCallCheck(this, B3), _super.apply(this, arguments);
        }
        return B3;
    }(A3), B4 = function(A7) {
        "use strict";
        _inherits(B4, A7);
        var _super = _createSuper(B4);
        function B4() {
            return _classCallCheck(this, B4), _super.apply(this, arguments);
        }
        return B4;
    }(A3), B5 = function(A8) {
        "use strict";
        _inherits(B5, A8);
        var _super = _createSuper(B5);
        function B5() {
            return _classCallCheck(this, B5), _super.apply(this, arguments);
        }
        return B5;
    }(A3);
}(Generics || (Generics = {}));
