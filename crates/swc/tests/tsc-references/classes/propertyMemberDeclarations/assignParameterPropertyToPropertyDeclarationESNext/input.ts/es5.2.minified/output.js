function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
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
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C(foo) {
        _classCallCheck(this, C), this.foo = foo, this.qux = this.bar, this.bar = this.foo, this.quiz = this.bar, this.quench = this.m1(), this.quanch = this.m3(), this.m3 = function() {
        }, this.quim = this.baz, this.baz = this.foo, this.quid = this.baz;
    }
    return protoProps = [
        {
            key: "m1",
            value: function() {
                this.foo;
            }
        },
        {
            key: "m2",
            value: function() {
                this.foo;
            }
        }
    ], _defineProperties((Constructor = C).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _createSuper(D);
    function D() {
        var _this;
        return _classCallCheck(this, D), _this = _super.apply(this, arguments), _this.quill = _this.foo, _this;
    }
    return D;
}(C), E = function(foo2) {
    "use strict";
    var _this = this;
    _classCallCheck(this, E), this.foo2 = foo2, this.bar = function() {
        return _this.foo1 + _this.foo2;
    }, this.foo1 = "";
}, F1 = function() {
    "use strict";
    _classCallCheck(this, F1), this.Inner = (function(F) {
        _inherits(_class, F);
        var _super = _createSuper(_class);
        function _class() {
            var _this;
            return _classCallCheck(this, _class), _this = _super.apply(this, arguments), _this.p2 = _this.p1, _this;
        }
        return _class;
    })(F1), this.p1 = 0;
}, G1 = function(p1) {
    "use strict";
    _classCallCheck(this, G1), this.p1 = p1, this.Inner = (function(G) {
        _inherits(_class, G);
        var _super = _createSuper(_class);
        function _class() {
            var _this;
            return _classCallCheck(this, _class), _this = _super.apply(this, arguments), _this.p2 = _this.p1, _this;
        }
        return _class;
    })(G1);
};
