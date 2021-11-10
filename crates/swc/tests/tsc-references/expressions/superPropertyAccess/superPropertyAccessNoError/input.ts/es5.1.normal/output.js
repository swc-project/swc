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
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
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
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var SomeBaseClass = // @target: es5
//super.publicInstanceMemberFunction in constructor of derived class
//super.publicInstanceMemberFunction in instance member function of derived class
//super.publicInstanceMemberFunction in instance member accessor(get and set) of derived class
//super.publicInstanceMemberFunction in lambda in member function
//super.publicStaticMemberFunction in static member function of derived class
//super.publicStaticMemberFunction in static member accessor(get and set) of derived class
/*#__PURE__*/ function() {
    "use strict";
    function SomeBaseClass() {
        _classCallCheck(this, SomeBaseClass);
    }
    _createClass(SomeBaseClass, [
        {
            key: "func",
            value: function func() {
                return '';
            }
        },
        {
            key: "returnThis",
            value: function returnThis() {
                return this;
            }
        }
    ], [
        {
            key: "func",
            value: function func() {
                return 3;
            }
        }
    ]);
    return SomeBaseClass;
}();
var SomeDerivedClass = /*#__PURE__*/ function(SomeBaseClass) {
    "use strict";
    _inherits(SomeDerivedClass, SomeBaseClass);
    var _super = _createSuper(SomeDerivedClass);
    function SomeDerivedClass() {
        _classCallCheck(this, SomeDerivedClass);
        var _thisSuper;
        var _this = _super.call(this);
        var x = _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(SomeDerivedClass.prototype)), "func", _thisSuper).call(_thisSuper);
        var x;
        return _this;
    }
    _createClass(SomeDerivedClass, [
        {
            key: "fn",
            value: function fn() {
                var _this = this;
                var x = _get(_getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
                var x;
                var y = function() {
                    return _get(_getPrototypeOf(SomeDerivedClass.prototype), "func", _this).call(_this);
                };
            }
        },
        {
            key: "a",
            get: function get() {
                var x = _get(_getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
                var x;
                return null;
            },
            set: function set(n) {
                var x = _get(_getPrototypeOf(SomeDerivedClass.prototype), "func", this).call(this);
                var x;
            }
        },
        {
            key: "returnThis",
            value: function returnThis() {
                return _get(_getPrototypeOf(SomeDerivedClass.prototype), "returnThis", this).call(this);
            }
        }
    ], [
        {
            key: "fn",
            value: function fn() {
                var x = _get(_getPrototypeOf(SomeDerivedClass), "func", this).call(this);
                var x;
            }
        },
        {
            key: "a",
            get: function get() {
                var x = _get(_getPrototypeOf(SomeDerivedClass), "func", this).call(this);
                var x;
                return null;
            },
            set: function set(n) {
                var x = _get(_getPrototypeOf(SomeDerivedClass), "func", this).call(this);
                var x;
            }
        }
    ]);
    return SomeDerivedClass;
}(SomeBaseClass);
var instance1 = new SomeDerivedClass();
instance1.returnThis().fn();
