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
function _get(target, property, receiver) {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (base) {
            var desc = Object.getOwnPropertyDescriptor(base, property);
            return desc.get ? desc.get.call(receiver) : desc.value;
        }
    }, _get(target, property, receiver || target);
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
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
var SomeBaseClass = function() {
    "use strict";
    function SomeBaseClass() {
        _classCallCheck(this, SomeBaseClass);
    }
    return _createClass(SomeBaseClass, [
        {
            key: "func",
            value: function() {
                return "";
            }
        },
        {
            key: "returnThis",
            value: function() {
                return this;
            }
        }
    ], [
        {
            key: "func",
            value: function() {
                return 3;
            }
        }
    ]), SomeBaseClass;
}(), SomeDerivedClass = function(SomeBaseClass) {
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
    }(SomeDerivedClass, SomeBaseClass);
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
    }(SomeDerivedClass);
    function SomeDerivedClass() {
        _classCallCheck(this, SomeDerivedClass);
        var _thisSuper, _this = _super.call(this);
        return _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(SomeDerivedClass.prototype)), "func", _thisSuper).call(_thisSuper), _this;
    }
    return _createClass(SomeDerivedClass, [
        {
            key: "fn",
            value: function() {
                _get(_getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
            }
        },
        {
            key: "a",
            get: function() {
                return _get(_getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this), null;
            },
            set: function(n) {
                _get(_getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
            }
        },
        {
            key: "returnThis",
            value: function() {
                return _get(_getPrototypeOf(SomeDerivedClass.prototype), "returnThis", this).call(this);
            }
        }
    ], [
        {
            key: "fn",
            value: function() {
                _get(_getPrototypeOf(SomeDerivedClass), "func", this).call(this);
            }
        },
        {
            key: "a",
            get: function() {
                return _get(_getPrototypeOf(SomeDerivedClass), "func", this).call(this), null;
            },
            set: function(n) {
                _get(_getPrototypeOf(SomeDerivedClass), "func", this).call(this);
            }
        }
    ]), SomeDerivedClass;
}(SomeBaseClass);
new SomeDerivedClass().returnThis().fn();
