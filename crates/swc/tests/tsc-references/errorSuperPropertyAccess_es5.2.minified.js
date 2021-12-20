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
function set(target, property, value, receiver) {
    return set = "undefined" != typeof Reflect && Reflect.set ? Reflect.set : function set(target, property, value, receiver) {
        var obj, key, value, desc, base = _superPropBase(target, property);
        if (base) {
            if ((desc = Object.getOwnPropertyDescriptor(base, property)).set) return desc.set.call(receiver, value), !0;
            if (!desc.writable) return !1;
        }
        if (desc = Object.getOwnPropertyDescriptor(receiver, property)) {
            if (!desc.writable) return !1;
            desc.value = value, Object.defineProperty(receiver, property, desc);
        } else obj = receiver, value = value, (key = property) in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value;
        return !0;
    }, set(target, property, value, receiver);
}
function _set(target, property, value, receiver, isStrict) {
    if (!set(target, property, value, receiver || target) && isStrict) throw new Error("failed to set property");
    return value;
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
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : _assertThisInitialized(self);
    };
}
var NoBase = function() {
    "use strict";
    function NoBase() {
        _classCallCheck(this, NoBase), this.m = _get(_getPrototypeOf(NoBase.prototype), "prototype", this), this.n = _get(_getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, ""), _get(_getPrototypeOf(NoBase.prototype), "prototype", this), _get(_getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, "");
    }
    return _createClass(NoBase, [
        {
            key: "fn",
            value: function() {
                _get(_getPrototypeOf(NoBase.prototype), "prototype", this), _get(_getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, "");
            }
        }
    ], [
        {
            key: "static1",
            value: function() {
                _get(_getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, "");
            }
        },
        {
            key: "static2",
            get: function() {
                return _get(_getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, ""), "";
            },
            set: function(n) {
                _get(_getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, "");
            }
        }
    ]), NoBase;
}(), SomeBase = function() {
    "use strict";
    function SomeBase() {
        _classCallCheck(this, SomeBase), this.privateMember = 0, this.publicMember = 0;
    }
    return _createClass(SomeBase, [
        {
            key: "privateFunc",
            value: function() {
            }
        },
        {
            key: "publicFunc",
            value: function() {
            }
        }
    ], [
        {
            key: "privateStaticFunc",
            value: function() {
            }
        },
        {
            key: "publicStaticFunc",
            value: function() {
            }
        }
    ]), SomeBase;
}();
SomeBase.privateStaticMember = 0, SomeBase.publicStaticMember = 0;
var SomeDerived1 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived1, SomeBase);
    var _super = _createSuper(SomeDerived1);
    function SomeDerived1() {
        _classCallCheck(this, SomeDerived1);
        var _thisSuper, _this = _super.call(this);
        return _set((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(SomeDerived1.prototype)), "publicMember", 1, _thisSuper, !0), _this;
    }
    return _createClass(SomeDerived1, [
        {
            key: "fn",
            value: function() {
                _get(_getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
            }
        },
        {
            key: "a",
            get: function() {
                _get(_getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
            },
            set: function(n) {
                _get(_getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
            }
        },
        {
            key: "fn2",
            value: function() {
            }
        }
    ]), SomeDerived1;
}(SomeBase), SomeDerived2 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived2, SomeBase);
    var _super = _createSuper(SomeDerived2);
    function SomeDerived2() {
        _classCallCheck(this, SomeDerived2);
        var _thisSuper, _this = _super.call(this);
        return _set((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(SomeDerived2.prototype)), "privateMember", 1, _thisSuper, !0), _this;
    }
    return _createClass(SomeDerived2, [
        {
            key: "fn",
            value: function() {
                _get(_getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
            }
        },
        {
            key: "a",
            get: function() {
                _get(_getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
            },
            set: function(n) {
                _get(_getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
            }
        }
    ]), SomeDerived2;
}(SomeBase), SomeDerived3 = function(SomeBase) {
    "use strict";
    _inherits(SomeDerived3, SomeBase);
    var _super = _createSuper(SomeDerived3);
    function SomeDerived3() {
        return _classCallCheck(this, SomeDerived3), _super.apply(this, arguments);
    }
    return _createClass(SomeDerived3, null, [
        {
            key: "fn",
            value: function() {
                _set(_getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), _set(_getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), _get(_getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
            }
        },
        {
            key: "a",
            get: function() {
                return _set(_getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), _set(_getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), _get(_getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this), "";
            },
            set: function(n) {
                _set(_getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), _set(_getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), _get(_getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
            }
        }
    ]), SomeDerived3;
}(SomeBase);
super.wat, super.foo();
