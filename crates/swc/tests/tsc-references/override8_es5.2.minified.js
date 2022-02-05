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
var B = function() {
    "use strict";
    _classCallCheck(this, B);
}, D = function(B1) {
    "use strict";
    _inherits(D, B1);
    var _super = _createSuper(D);
    function D(a, b) {
        var _this;
        return _classCallCheck(this, D), (_this = _super.call(this)).a = a, _this.b = b, _this;
    }
    return D;
}(B), BB = function(a) {
    "use strict";
    _classCallCheck(this, BB), this.a = a;
}, DD = function(BB1) {
    "use strict";
    _inherits(DD, BB1);
    var _super = _createSuper(DD);
    function DD(a) {
        var _this;
        return _classCallCheck(this, DD), (_this = _super.call(this, a)).a = a, _this;
    }
    return DD;
}(BB), DDD = function(BB2) {
    "use strict";
    _inherits(DDD, BB2);
    var _super = _createSuper(DDD);
    function DDD(a) {
        var _this;
        return _classCallCheck(this, DDD), (_this = _super.call(this, a)).a = a, _this;
    }
    return DDD;
}(BB);
