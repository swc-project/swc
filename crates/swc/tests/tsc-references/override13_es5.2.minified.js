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
function _createSuper(Derived1) {
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
        var obj, self, call, result, Super = _getPrototypeOf(Derived1);
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
var Foo = function() {
    "use strict";
    _classCallCheck(this, Foo), this.property = 1;
};
Foo.staticProperty = 2;
var SubFoo = function(Foo1) {
    "use strict";
    _inherits(SubFoo, Foo1);
    var _super = _createSuper(SubFoo);
    function SubFoo() {
        var _this;
        return _classCallCheck(this, SubFoo), _this = _super.apply(this, arguments), _this.property = 42, _this.staticProperty = 42, _this;
    }
    return SubFoo;
}(Foo), StaticSubFoo = function(Foo2) {
    "use strict";
    _inherits(StaticSubFoo, Foo2);
    var _super = _createSuper(StaticSubFoo);
    function StaticSubFoo() {
        return _classCallCheck(this, StaticSubFoo), _super.apply(this, arguments);
    }
    return StaticSubFoo;
}(Foo);
StaticSubFoo.property = 42, StaticSubFoo.staticProperty = 42;
var Intermediate = function(Foo3) {
    "use strict";
    _inherits(Intermediate, Foo3);
    var _super = _createSuper(Intermediate);
    function Intermediate() {
        return _classCallCheck(this, Intermediate), _super.apply(this, arguments);
    }
    return Intermediate;
}(Foo), Derived = function(Intermediate) {
    "use strict";
    _inherits(Derived, Intermediate);
    var _super = _createSuper(Derived);
    function Derived() {
        var _this;
        return _classCallCheck(this, Derived), _this = _super.apply(this, arguments), _this.property = 42, _this.staticProperty = 42, _this;
    }
    return Derived;
}(Intermediate), StaticDerived = function(Intermediate) {
    "use strict";
    _inherits(StaticDerived, Intermediate);
    var _super = _createSuper(StaticDerived);
    function StaticDerived() {
        return _classCallCheck(this, StaticDerived), _super.apply(this, arguments);
    }
    return StaticDerived;
}(Intermediate);
StaticDerived.property = 42, StaticDerived.staticProperty = 42;
