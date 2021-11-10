function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
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
var BaseA = function() {
    "use strict";
    function BaseA(x) {
        _classCallCheck(this, BaseA), this.x = x;
    }
    return _createClass(BaseA, [
        {
            key: "createInstance",
            value: function() {
                new BaseA(1);
            }
        }
    ]), BaseA;
}(), BaseB = function() {
    "use strict";
    function BaseB(x) {
        _classCallCheck(this, BaseB), this.x = x;
    }
    return _createClass(BaseB, [
        {
            key: "createInstance",
            value: function() {
                new BaseB(2);
            }
        }
    ]), BaseB;
}(), BaseC = function() {
    "use strict";
    function BaseC(x) {
        _classCallCheck(this, BaseC), this.x = x;
    }
    return _createClass(BaseC, [
        {
            key: "createInstance",
            value: function() {
                new BaseC(3);
            }
        }
    ], [
        {
            key: "staticInstance",
            value: function() {
                new BaseC(4);
            }
        }
    ]), BaseC;
}(), DerivedA = function(BaseA1) {
    "use strict";
    _inherits(DerivedA, BaseA1);
    var _super = _createSuper(DerivedA);
    function DerivedA(x) {
        var _this;
        return _classCallCheck(this, DerivedA), (_this = _super.call(this, x)).x = x, _this;
    }
    return _createClass(DerivedA, [
        {
            key: "createInstance",
            value: function() {
                new DerivedA(5);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseA(6);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseA(7);
            }
        }
    ]), DerivedA;
}(BaseA), DerivedB = function(BaseB1) {
    "use strict";
    _inherits(DerivedB, BaseB1);
    var _super = _createSuper(DerivedB);
    function DerivedB(x) {
        var _this;
        return _classCallCheck(this, DerivedB), (_this = _super.call(this, x)).x = x, _this;
    }
    return _createClass(DerivedB, [
        {
            key: "createInstance",
            value: function() {
                new DerivedB(7);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseB(8);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseB(9);
            }
        }
    ]), DerivedB;
}(BaseB), DerivedC = function(BaseC1) {
    "use strict";
    _inherits(DerivedC, BaseC1);
    var _super = _createSuper(DerivedC);
    function DerivedC(x) {
        var _this;
        return _classCallCheck(this, DerivedC), (_this = _super.call(this, x)).x = x, _this;
    }
    return _createClass(DerivedC, [
        {
            key: "createInstance",
            value: function() {
                new DerivedC(9);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseC(10);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseC(11);
            }
        }
    ]), DerivedC;
}(BaseC);
new BaseA(1), new BaseB(1), new BaseC(1), new DerivedA(1), new DerivedB(1), new DerivedC(1);
