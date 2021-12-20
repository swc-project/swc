function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
var Foo = function() {
    "use strict";
    _classCallCheck(this, Foo);
}, Bar = function() {
    "use strict";
    _classCallCheck(this, Bar);
}, Bar2 = function() {
    "use strict";
    _classCallCheck(this, Bar2);
}, Bar3 = function() {
    "use strict";
    _classCallCheck(this, Bar3);
}, Bar4 = function() {
    "use strict";
    _classCallCheck(this, Bar4);
}, Bar5 = function(Foo1) {
    "use strict";
    _inherits(Bar5, Foo1);
    var _super = _createSuper(Bar5);
    function Bar5() {
        return _classCallCheck(this, Bar5), _super.apply(this, arguments);
    }
    return Bar5;
}(Foo), Bar6 = function(Foo2) {
    "use strict";
    _inherits(Bar6, Foo2);
    var _super = _createSuper(Bar6);
    function Bar6() {
        return _classCallCheck(this, Bar6), _super.apply(this, arguments);
    }
    return Bar6;
}(Foo), Bar7 = function(Foo3) {
    "use strict";
    _inherits(Bar7, Foo3);
    var _super = _createSuper(Bar7);
    function Bar7() {
        return _classCallCheck(this, Bar7), _super.apply(this, arguments);
    }
    return Bar7;
}(Foo), Bar8 = function(Foo4) {
    "use strict";
    _inherits(Bar8, Foo4);
    var _super = _createSuper(Bar8);
    function Bar8() {
        return _classCallCheck(this, Bar8), _super.apply(this, arguments);
    }
    return Bar8;
}(Foo);
