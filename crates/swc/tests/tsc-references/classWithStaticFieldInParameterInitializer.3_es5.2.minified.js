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
var _class, _class1, C = function() {
    "use strict";
    _classCallCheck(this, C);
};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ((_class = (function(C1) {
        "use strict";
        _inherits(_class2, C1);
        var _super = _createSuper(_class2);
        function _class2() {
            return _classCallCheck(this, _class2), _super.apply(this, arguments);
        }
        return _class2;
    })(C)).x = 1, _class);
}(), (function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ((_class1 = (function(C2) {
        "use strict";
        _inherits(_class2, C2);
        var _super = _createSuper(_class2);
        function _class2() {
            return _classCallCheck(this, _class2), _super.apply(this, arguments);
        }
        return _class2;
    })(C)).x = 1, _class1), arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
})();
