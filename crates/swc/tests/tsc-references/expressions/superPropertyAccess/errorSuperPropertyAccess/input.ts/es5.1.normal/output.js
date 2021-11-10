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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
        set = Reflect.set;
    } else {
        set = function set(target, property, value, receiver) {
            var base = _superPropBase(target, property);
            var desc;
            if (base) {
                desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.set) {
                    desc.set.call(receiver, value);
                    return true;
                } else if (!desc.writable) {
                    return false;
                }
            }
            desc = Object.getOwnPropertyDescriptor(receiver, property);
            if (desc) {
                if (!desc.writable) {
                    return false;
                }
                desc.value = value;
                Object.defineProperty(receiver, property, desc);
            } else {
                _defineProperty(receiver, property, value);
            }
            return true;
        };
    }
    return set(target, property, value, receiver);
}
function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);
    if (!s && isStrict) {
        throw new Error("failed to set property");
    }
    return value;
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
var NoBase = //super property access in constructor of class with no base type
//super property access in instance member function of class with no base type
//super property access in instance member accessor(get and set) of class with no base type
/*#__PURE__*/ function() {
    "use strict";
    function NoBase() {
        _classCallCheck(this, NoBase);
        this.m = _get(_getPrototypeOf(NoBase.prototype), "prototype", this);
        this.n = _get(_getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, '');
        var a = _get(_getPrototypeOf(NoBase.prototype), "prototype", this);
        var b = _get(_getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, '');
    }
    _createClass(NoBase, [
        {
            key: "fn",
            value: function fn() {
                var a = _get(_getPrototypeOf(NoBase.prototype), "prototype", this);
                var b = _get(_getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, '');
            }
        }
    ], [
        {
            key: "static1",
            value: //super static property access in static member function of class with no base type
            //super static property access in static member accessor(get and set) of class with no base type
            function static1() {
                _get(_getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, '');
            }
        },
        {
            key: "static2",
            get: function get() {
                _get(_getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, '');
                return '';
            },
            set: function set(n) {
                _get(_getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, '');
            }
        }
    ]);
    return NoBase;
}();
var SomeBase = /*#__PURE__*/ function() {
    "use strict";
    function SomeBase() {
        _classCallCheck(this, SomeBase);
        this.privateMember = 0;
        this.publicMember = 0;
    }
    _createClass(SomeBase, [
        {
            key: "privateFunc",
            value: function privateFunc() {
            }
        },
        {
            key: "publicFunc",
            value: function publicFunc() {
            }
        }
    ], [
        {
            key: "privateStaticFunc",
            value: function privateStaticFunc() {
            }
        },
        {
            key: "publicStaticFunc",
            value: function publicStaticFunc() {
            }
        }
    ]);
    return SomeBase;
}();
SomeBase.privateStaticMember = 0;
SomeBase.publicStaticMember = 0;
var SomeDerived1 = //super.publicInstanceMemberNotFunction in constructor of derived class
//super.publicInstanceMemberNotFunction in instance member function of derived class
//super.publicInstanceMemberNotFunction in instance member accessor(get and set) of derived class
//super property access only available with typed this
/*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived1, SomeBase);
    var _super = _createSuper(SomeDerived1);
    function SomeDerived1() {
        _classCallCheck(this, SomeDerived1);
        var _thisSuper;
        var _this = _super.call(this);
        _set((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(SomeDerived1.prototype)), "publicMember", 1, _thisSuper, true);
        return _this;
    }
    _createClass(SomeDerived1, [
        {
            key: "fn",
            value: function fn() {
                var x = _get(_getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
            }
        },
        {
            key: "a",
            get: function get() {
                var x = _get(_getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
                return undefined;
            },
            set: function set(n) {
                n = _get(_getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
            }
        },
        {
            key: "fn2",
            value: function fn2() {
                var inner = function inner() {
                    _get(_getPrototypeOf(SomeDerived1.prototype), "publicFunc", this).call(this);
                };
                var x = {
                    test: function test() {
                        return _get(_getPrototypeOf(SomeDerived1.prototype), "publicFunc", this).call(this);
                    }
                };
            }
        }
    ]);
    return SomeDerived1;
}(SomeBase);
var SomeDerived2 = //super.privateProperty in constructor of derived class
//super.privateProperty in instance member function of derived class
//super.privateProperty in instance member accessor(get and set) of derived class
/*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived2, SomeBase);
    var _super = _createSuper(SomeDerived2);
    function SomeDerived2() {
        _classCallCheck(this, SomeDerived2);
        var _thisSuper;
        var _this = _super.call(this);
        _set((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(SomeDerived2.prototype)), "privateMember", 1, _thisSuper, true);
        return _this;
    }
    _createClass(SomeDerived2, [
        {
            key: "fn",
            value: function fn() {
                var x = _get(_getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
            }
        },
        {
            key: "a",
            get: function get() {
                var x = _get(_getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
                return undefined;
            },
            set: function set(n) {
                n = _get(_getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
            }
        }
    ]);
    return SomeDerived2;
}(SomeBase);
var SomeDerived3 = //super.publicStaticMemberNotFunction in static member function of derived class
//super.publicStaticMemberNotFunction in static member accessor(get and set) of derived class
//super.privateStaticProperty in static member function of derived class
//super.privateStaticProperty in static member accessor(get and set) of derived class
/*#__PURE__*/ function(SomeBase) {
    "use strict";
    _inherits(SomeDerived3, SomeBase);
    var _super = _createSuper(SomeDerived3);
    function SomeDerived3() {
        _classCallCheck(this, SomeDerived3);
        return _super.apply(this, arguments);
    }
    _createClass(SomeDerived3, null, [
        {
            key: "fn",
            value: function fn() {
                _set(_getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
                _set(_getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
                _get(_getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
            }
        },
        {
            key: "a",
            get: function get() {
                _set(_getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
                _set(_getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
                _get(_getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
                return '';
            },
            set: function set(n) {
                _set(_getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, true);
                _set(_getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, true);
                _get(_getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
            }
        }
    ]);
    return SomeDerived3;
}(SomeBase);
// In object literal
var obj1 = {
    n: super.wat,
    p: super.foo()
};
