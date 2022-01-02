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
var M, M2, Foo = function() {
    "use strict";
    _classCallCheck(this, Foo);
}, Bar = function(Foo1) {
    "use strict";
    _inherits(Bar, Foo1);
    var _super = _createSuper(Bar);
    function Bar() {
        return _classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    return Bar;
}(Foo), Bar2 = function(Foo2) {
    "use strict";
    _inherits(Bar2, Foo2);
    var _super = _createSuper(Bar2);
    function Bar2() {
        return _classCallCheck(this, Bar2), _super.apply(this, arguments);
    }
    return Bar2;
}(Foo), Bar3 = function(Foo3) {
    "use strict";
    _inherits(Bar3, Foo3);
    var _super = _createSuper(Bar3);
    function Bar3() {
        return _classCallCheck(this, Bar3), _super.apply(this, arguments);
    }
    return Bar3;
}(Foo);
!function(M) {
    var Foo4 = function() {
        "use strict";
        _classCallCheck(this, Foo4);
    }, Baz = function(Foo5) {
        "use strict";
        _inherits(Baz, Foo5);
        var _super = _createSuper(Baz);
        function Baz() {
            return _classCallCheck(this, Baz), _super.apply(this, arguments);
        }
        return Baz;
    }(Foo4), Bar = function(Foo6) {
        "use strict";
        _inherits(Bar, Foo6);
        var _super = _createSuper(Bar);
        function Bar() {
            return _classCallCheck(this, Bar), _super.apply(this, arguments);
        }
        return Bar;
    }(Foo4), Bar2 = function(Foo7) {
        "use strict";
        _inherits(Bar2, Foo7);
        var _super = _createSuper(Bar2);
        function Bar2() {
            return _classCallCheck(this, Bar2), _super.apply(this, arguments);
        }
        return Bar2;
    }(Foo4), Bar3 = function(Foo8) {
        "use strict";
        _inherits(Bar3, Foo8);
        var _super = _createSuper(Bar3);
        function Bar3() {
            return _classCallCheck(this, Bar3), _super.apply(this, arguments);
        }
        return Bar3;
    }(Foo4);
}(M || (M = {})), (function(M2) {
    var b, Foo9 = function() {
        "use strict";
        _classCallCheck(this, Foo9);
    }, Baz = function(Foo10) {
        "use strict";
        _inherits(Baz, Foo10);
        var _super = _createSuper(Baz);
        function Baz() {
            return _classCallCheck(this, Baz), _super.apply(this, arguments);
        }
        return Baz;
    }(Foo9), Bar = function(Foo11) {
        "use strict";
        _inherits(Bar, Foo11);
        var _super = _createSuper(Bar);
        function Bar() {
            return _classCallCheck(this, Bar), _super.apply(this, arguments);
        }
        return Bar;
    }(Foo9);
    b.z, b.x, b.y;
    var Bar2 = function(Foo12) {
        "use strict";
        _inherits(Bar2, Foo12);
        var _super = _createSuper(Bar2);
        function Bar2() {
            return _classCallCheck(this, Bar2), _super.apply(this, arguments);
        }
        return Bar2;
    }(Foo9), Bar3 = function(Foo13) {
        "use strict";
        _inherits(Bar3, Foo13);
        var _super = _createSuper(Bar3);
        function Bar3() {
            return _classCallCheck(this, Bar3), _super.apply(this, arguments);
        }
        return Bar3;
    }(Foo9);
})(M2 || (M2 = {}));
