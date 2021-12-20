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
var x, Base = function() {
    "use strict";
    function Base(a) {
        _classCallCheck(this, Base);
    }
    return _createClass(Base, [
        {
            key: "b",
            value: function(a) {
            }
        },
        {
            key: "c",
            get: function() {
                return x;
            },
            set: function(v) {
            }
        }
    ], [
        {
            key: "s",
            value: function(a) {
            }
        },
        {
            key: "t",
            get: function() {
                return x;
            },
            set: function(v) {
            }
        }
    ]), Base;
}(), Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _createSuper(Derived1);
    function Derived1(a) {
        return _classCallCheck(this, Derived1), _super.call(this, a);
    }
    return Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _createSuper(Derived2);
    function Derived2(a) {
        return _classCallCheck(this, Derived2), _super.call(this, a);
    }
    return _createClass(Derived2, [
        {
            key: "b",
            value: function(a) {
            }
        }
    ]), Derived2;
}(Base), Derived3 = function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _createSuper(Derived3);
    function Derived3(a) {
        return _classCallCheck(this, Derived3), _super.call(this, a);
    }
    return _createClass(Derived3, [
        {
            key: "c",
            get: function() {
                return x;
            }
        }
    ]), Derived3;
}(Base), Derived4 = function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    var _super = _createSuper(Derived4);
    function Derived4(a) {
        return _classCallCheck(this, Derived4), _super.call(this, a);
    }
    return _createClass(Derived4, [
        {
            key: "c",
            set: function(v) {
            }
        }
    ]), Derived4;
}(Base), Derived5 = function(Base) {
    "use strict";
    _inherits(Derived5, Base);
    var _super = _createSuper(Derived5);
    function Derived5(a) {
        return _classCallCheck(this, Derived5), _super.call(this, a);
    }
    return Derived5;
}(Base), Derived6 = function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    var _super = _createSuper(Derived6);
    function Derived6(a) {
        return _classCallCheck(this, Derived6), _super.call(this, a);
    }
    return Derived6;
}(Base), Derived7 = function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    var _super = _createSuper(Derived7);
    function Derived7(a) {
        return _classCallCheck(this, Derived7), _super.call(this, a);
    }
    return _createClass(Derived7, null, [
        {
            key: "s",
            value: function(a) {
            }
        }
    ]), Derived7;
}(Base), Derived8 = function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    var _super = _createSuper(Derived8);
    function Derived8(a) {
        return _classCallCheck(this, Derived8), _super.call(this, a);
    }
    return _createClass(Derived8, null, [
        {
            key: "t",
            get: function() {
                return x;
            }
        }
    ]), Derived8;
}(Base), Derived9 = function(Base) {
    "use strict";
    _inherits(Derived9, Base);
    var _super = _createSuper(Derived9);
    function Derived9(a) {
        return _classCallCheck(this, Derived9), _super.call(this, a);
    }
    return _createClass(Derived9, null, [
        {
            key: "t",
            set: function(v) {
            }
        }
    ]), Derived9;
}(Base), Derived10 = function(Base) {
    "use strict";
    _inherits(Derived10, Base);
    var _super = _createSuper(Derived10);
    function Derived10(a) {
        return _classCallCheck(this, Derived10), _super.call(this, a);
    }
    return Derived10;
}(Base);
