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
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived1) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived1), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
    this.property = 1;
};
Foo.staticProperty = 2;
var SubFoo = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(SubFoo, Foo);
    var _super = _createSuper(SubFoo);
    function SubFoo() {
        _classCallCheck(this, SubFoo);
        var _this;
        _this = _super.apply(this, arguments);
        _this.property = 42;
        _this.staticProperty = 42;
        return _this;
    }
    return SubFoo;
}(Foo);
var StaticSubFoo = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(StaticSubFoo, Foo);
    var _super = _createSuper(StaticSubFoo);
    function StaticSubFoo() {
        _classCallCheck(this, StaticSubFoo);
        return _super.apply(this, arguments);
    }
    return StaticSubFoo;
}(Foo);
StaticSubFoo.property = 42;
StaticSubFoo.staticProperty = 42;
var Intermediate = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Intermediate, Foo);
    var _super = _createSuper(Intermediate);
    function Intermediate() {
        _classCallCheck(this, Intermediate);
        return _super.apply(this, arguments);
    }
    return Intermediate;
}(Foo);
var Derived = /*#__PURE__*/ function(Intermediate) {
    "use strict";
    _inherits(Derived, Intermediate);
    var _super = _createSuper(Derived);
    function Derived() {
        _classCallCheck(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.property = 42;
        _this.staticProperty = 42;
        return _this;
    }
    return Derived;
}(Intermediate);
var StaticDerived = /*#__PURE__*/ function(Intermediate) {
    "use strict";
    _inherits(StaticDerived, Intermediate);
    var _super = _createSuper(StaticDerived);
    function StaticDerived() {
        _classCallCheck(this, StaticDerived);
        return _super.apply(this, arguments);
    }
    return StaticDerived;
}(Intermediate);
StaticDerived.property = 42;
StaticDerived.staticProperty = 42;
