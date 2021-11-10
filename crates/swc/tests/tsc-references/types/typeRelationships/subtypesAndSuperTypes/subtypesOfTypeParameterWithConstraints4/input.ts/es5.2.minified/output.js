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
}, B11 = function() {
    "use strict";
    _classCallCheck(this, B11);
}, D1 = function(B1) {
    "use strict";
    _inherits(D1, B1);
    var _super = _createSuper(D1);
    function D1() {
        return _classCallCheck(this, D1), _super.apply(this, arguments);
    }
    return D1;
}(B11), D2 = function(B1) {
    "use strict";
    _inherits(D2, B1);
    var _super = _createSuper(D2);
    function D2() {
        return _classCallCheck(this, D2), _super.apply(this, arguments);
    }
    return D2;
}(B11), D3 = function(B1) {
    "use strict";
    _inherits(D3, B1);
    var _super = _createSuper(D3);
    function D3() {
        return _classCallCheck(this, D3), _super.apply(this, arguments);
    }
    return D3;
}(B11), D4 = function(B1) {
    "use strict";
    _inherits(D4, B1);
    var _super = _createSuper(D4);
    function D4() {
        return _classCallCheck(this, D4), _super.apply(this, arguments);
    }
    return D4;
}(B11), D5 = function(B1) {
    "use strict";
    _inherits(D5, B1);
    var _super = _createSuper(D5);
    function D5() {
        return _classCallCheck(this, D5), _super.apply(this, arguments);
    }
    return D5;
}(B11), D6 = function(B1) {
    "use strict";
    _inherits(D6, B1);
    var _super = _createSuper(D6);
    function D6() {
        return _classCallCheck(this, D6), _super.apply(this, arguments);
    }
    return D6;
}(B11), D7 = function(B1) {
    "use strict";
    _inherits(D7, B1);
    var _super = _createSuper(D7);
    function D7() {
        return _classCallCheck(this, D7), _super.apply(this, arguments);
    }
    return D7;
}(B11), D8 = function(B1) {
    "use strict";
    _inherits(D8, B1);
    var _super = _createSuper(D8);
    function D8() {
        return _classCallCheck(this, D8), _super.apply(this, arguments);
    }
    return D8;
}(B11), D9 = function(B1) {
    "use strict";
    _inherits(D9, B1);
    var _super = _createSuper(D9);
    function D9() {
        return _classCallCheck(this, D9), _super.apply(this, arguments);
    }
    return D9;
}(B11);
