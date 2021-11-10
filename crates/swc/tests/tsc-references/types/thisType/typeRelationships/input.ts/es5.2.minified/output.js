function _assertThisInitialized(self) {
    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
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
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C), this.self = this, this.c = new C();
    }
    return _createClass(C, [
        {
            key: "foo",
            value: function() {
                return this;
            }
        },
        {
            key: "f1",
            value: function() {
                this.c = this.self, this.self = this.c;
            }
        },
        {
            key: "f2",
            value: function() {
                this.c, this.self;
            }
        },
        {
            key: "f3",
            value: function(b) {
                return b ? this.c : this.self;
            }
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(D, C);
    var _super = function(Derived) {
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
            return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : _assertThisInitialized(self);
        };
    }(D);
    function D() {
        var _this;
        return _classCallCheck(this, D), _this = _super.apply(this, arguments), _this.self1 = _assertThisInitialized(_this), _this.self2 = _this.self, _this.self3 = _this.foo(), _this.d = new D(), _this;
    }
    return _createClass(D, [
        {
            key: "bar",
            value: function() {
                this.self = this.self1, this.self = this.self2, this.self = this.self3, this.self1 = this.self, this.self2 = this.self, this.self3 = this.self, this.d = this.self, this.d = this.c, this.self = this.d, this.c = this.d;
            }
        }
    ]), D;
}(C);
