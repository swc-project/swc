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
var M, M2, Foo1 = function() {
    "use strict";
    _classCallCheck(this, Foo1);
}, Bar = function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _createSuper(Bar);
    function Bar() {
        return _classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    return Bar;
}(Foo1), Bar2 = function(Foo) {
    "use strict";
    _inherits(Bar2, Foo);
    var _super = _createSuper(Bar2);
    function Bar2() {
        return _classCallCheck(this, Bar2), _super.apply(this, arguments);
    }
    return Bar2;
}(Foo1), Bar3 = function(Foo) {
    "use strict";
    _inherits(Bar3, Foo);
    var _super = _createSuper(Bar3);
    function Bar3() {
        return _classCallCheck(this, Bar3), _super.apply(this, arguments);
    }
    return Bar3;
}(Foo1);
!function(M) {
    var Foo2 = function() {
        "use strict";
        _classCallCheck(this, Foo2);
    }, Baz = function(Foo) {
        "use strict";
        _inherits(Baz, Foo);
        var _super = _createSuper(Baz);
        function Baz() {
            return _classCallCheck(this, Baz), _super.apply(this, arguments);
        }
        return Baz;
    }(Foo2), Bar = function(Foo) {
        "use strict";
        _inherits(Bar, Foo);
        var _super = _createSuper(Bar);
        function Bar() {
            return _classCallCheck(this, Bar), _super.apply(this, arguments);
        }
        return Bar;
    }(Foo2), Bar2 = function(Foo) {
        "use strict";
        _inherits(Bar2, Foo);
        var _super = _createSuper(Bar2);
        function Bar2() {
            return _classCallCheck(this, Bar2), _super.apply(this, arguments);
        }
        return Bar2;
    }(Foo2), Bar3 = function(Foo) {
        "use strict";
        _inherits(Bar3, Foo);
        var _super = _createSuper(Bar3);
        function Bar3() {
            return _classCallCheck(this, Bar3), _super.apply(this, arguments);
        }
        return Bar3;
    }(Foo2);
}(M || (M = {
})), (function(M2) {
    var b, Foo3 = function() {
        "use strict";
        _classCallCheck(this, Foo3);
    }, Baz = function(Foo) {
        "use strict";
        _inherits(Baz, Foo);
        var _super = _createSuper(Baz);
        function Baz() {
            return _classCallCheck(this, Baz), _super.apply(this, arguments);
        }
        return Baz;
    }(Foo3), Bar = function(Foo) {
        "use strict";
        _inherits(Bar, Foo);
        var _super = _createSuper(Bar);
        function Bar() {
            return _classCallCheck(this, Bar), _super.apply(this, arguments);
        }
        return Bar;
    }(Foo3);
    b.z, b.x, b.y;
    var Bar2 = function(Foo) {
        "use strict";
        _inherits(Bar2, Foo);
        var _super = _createSuper(Bar2);
        function Bar2() {
            return _classCallCheck(this, Bar2), _super.apply(this, arguments);
        }
        return Bar2;
    }(Foo3), Bar3 = function(Foo) {
        "use strict";
        _inherits(Bar3, Foo);
        var _super = _createSuper(Bar3);
        function Bar3() {
            return _classCallCheck(this, Bar3), _super.apply(this, arguments);
        }
        return Bar3;
    }(Foo3);
})(M2 || (M2 = {
}));
