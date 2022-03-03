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
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
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
var Private = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _classCallCheck(this, Private);
}, Private2 = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _classCallCheck(this, Private2);
}, Protected = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _classCallCheck(this, Protected);
}, Protected2 = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _classCallCheck(this, Protected2);
}, Public = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _classCallCheck(this, Public);
}, Public2 = function() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    _classCallCheck(this, Public2);
}, C1 = function(_superClass) {
    "use strict";
    _inherits(C1, _superClass);
    var _super = _createSuper(C1);
    function C1() {
        return _classCallCheck(this, C1), _super.apply(this, arguments);
    }
    return C1;
}(Mix(Private, Private2)), C2 = function(_superClass) {
    "use strict";
    _inherits(C2, _superClass);
    var _super = _createSuper(C2);
    function C2() {
        return _classCallCheck(this, C2), _super.apply(this, arguments);
    }
    return C2;
}(Mix(Private, Protected)), C3 = function(_superClass) {
    "use strict";
    _inherits(C3, _superClass);
    var _super = _createSuper(C3);
    function C3() {
        return _classCallCheck(this, C3), _super.apply(this, arguments);
    }
    return C3;
}(Mix(Private, Public)), C4 = function(_superClass) {
    "use strict";
    _inherits(C4, _superClass);
    var _super = _createSuper(C4);
    function C4() {
        return _classCallCheck(this, C4), _super.apply(this, arguments);
    }
    return _createClass(C4, [
        {
            key: "f",
            value: function(c4, c5, c6) {
                c4.p, c5.p, c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function() {
                C4.s, C5.s, C6.s;
            }
        }
    ]), C4;
}(Mix(Protected, Protected2)), C5 = function(_superClass) {
    "use strict";
    _inherits(C5, _superClass);
    var _super = _createSuper(C5);
    function C5() {
        return _classCallCheck(this, C5), _super.apply(this, arguments);
    }
    return _createClass(C5, [
        {
            key: "f",
            value: function(c4, c5, c6) {
                c4.p, c5.p, c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function() {
                C4.s, C5.s, C6.s;
            }
        }
    ]), C5;
}(Mix(Protected, Public)), C6 = function(_superClass) {
    "use strict";
    _inherits(C6, _superClass);
    var _super = _createSuper(C6);
    function C6() {
        return _classCallCheck(this, C6), _super.apply(this, arguments);
    }
    return _createClass(C6, [
        {
            key: "f",
            value: function(c4, c5, c6) {
                c4.p, c5.p, c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function() {
                C4.s, C5.s, C6.s;
            }
        }
    ]), C6;
}(Mix(Public, Public2)), ProtectedGeneric = function() {
    "use strict";
    function ProtectedGeneric() {
        _classCallCheck(this, ProtectedGeneric);
    }
    return _createClass(ProtectedGeneric, [
        {
            key: "privateMethod",
            value: function() {}
        },
        {
            key: "protectedMethod",
            value: function() {}
        }
    ]), ProtectedGeneric;
}(), ProtectedGeneric2 = function() {
    "use strict";
    function ProtectedGeneric2() {
        _classCallCheck(this, ProtectedGeneric2);
    }
    return _createClass(ProtectedGeneric2, [
        {
            key: "privateMethod",
            value: function() {}
        },
        {
            key: "protectedMethod",
            value: function() {}
        }
    ]), ProtectedGeneric2;
}();
