var OnlyDerived, WithBase;
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
!function(OnlyDerived) {
    var Base1 = function() {
        "use strict";
        _classCallCheck(this, Base1);
    }, Derived = function(Base) {
        "use strict";
        _inherits(Derived, Base);
        var _super = _createSuper(Derived);
        function Derived() {
            return _classCallCheck(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base1), Derived2 = function(Base) {
        "use strict";
        _inherits(Derived2, Base);
        var _super = _createSuper(Derived2);
        function Derived2() {
            return _classCallCheck(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Base1), S = function() {
        "use strict";
        _classCallCheck(this, S);
    }, T = function() {
        "use strict";
        _classCallCheck(this, T);
    };
    new Derived(), new Derived2();
}(OnlyDerived || (OnlyDerived = {})), (function(WithBase) {
    var Base2 = function() {
        "use strict";
        _classCallCheck(this, Base2);
    }, Derived = function(Base) {
        "use strict";
        _inherits(Derived, Base);
        var _super = _createSuper(Derived);
        function Derived() {
            return _classCallCheck(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base2), Derived2 = function(Base) {
        "use strict";
        _inherits(Derived2, Base);
        var _super = _createSuper(Derived2);
        function Derived2() {
            return _classCallCheck(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Base2), S = function() {
        "use strict";
        _classCallCheck(this, S);
    }, T = function() {
        "use strict";
        _classCallCheck(this, T);
    };
    new Base2(), new Derived2();
})(WithBase || (WithBase = {}));
