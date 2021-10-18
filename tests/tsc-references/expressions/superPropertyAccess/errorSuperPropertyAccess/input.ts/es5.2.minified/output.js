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
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
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
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, NoBase = function() {
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
    function SomeDerived1() {
        _classCallCheck(this, SomeDerived1);
        var _this = _possibleConstructorReturn(this, _getPrototypeOf(SomeDerived1).call(this));
        return _set(_getPrototypeOf(SomeDerived1.prototype), "publicMember", 1, this, !0), _this;
    }
    return _inherits(SomeDerived1, SomeBase), _createClass(SomeDerived1, [
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
    function SomeDerived2() {
        _classCallCheck(this, SomeDerived2);
        var _this = _possibleConstructorReturn(this, _getPrototypeOf(SomeDerived2).call(this));
        return _set(_getPrototypeOf(SomeDerived2.prototype), "privateMember", 1, this, !0), _this;
    }
    return _inherits(SomeDerived2, SomeBase), _createClass(SomeDerived2, [
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
    function SomeDerived3() {
        return _classCallCheck(this, SomeDerived3), _possibleConstructorReturn(this, _getPrototypeOf(SomeDerived3).apply(this, arguments));
    }
    return _inherits(SomeDerived3, SomeBase), _createClass(SomeDerived3, null, [
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
