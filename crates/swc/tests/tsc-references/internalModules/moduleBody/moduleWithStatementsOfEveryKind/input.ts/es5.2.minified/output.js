var Y1;
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
!function(A3) {
    var Module, Color, A1, Color1, A2 = function() {
        "use strict";
        _classCallCheck(this, A2);
    }, AA1 = function() {
        "use strict";
        _classCallCheck(this, AA1);
    }, B = function(AA) {
        "use strict";
        _inherits(B, AA);
        var _super = _createSuper(B);
        function B() {
            return _classCallCheck(this, B), _super.apply(this, arguments);
        }
        return B;
    }(AA1), BB = function(A) {
        "use strict";
        _inherits(BB, A);
        var _super = _createSuper(BB);
        function BB() {
            return _classCallCheck(this, BB), _super.apply(this, arguments);
        }
        return BB;
    }(A2);
    Module || (Module = {
    }), A1 = function() {
        "use strict";
        _classCallCheck(this, A1);
    }, (Color1 = Color || (Color = {
    }))[Color1.Blue = 0] = "Blue", Color1[Color1.Red = 1] = "Red";
}(A || (A = {
})), (function(Y) {
    var A5 = function() {
        "use strict";
        _classCallCheck(this, A5);
    };
    Y.A = A5;
    var AA2 = function() {
        "use strict";
        _classCallCheck(this, AA2);
    };
    Y.AA = AA2;
    var B = function(AA) {
        "use strict";
        _inherits(B, AA);
        var _super = _createSuper(B);
        function B() {
            return _classCallCheck(this, B), _super.apply(this, arguments);
        }
        return B;
    }(AA2);
    Y.B = B;
    var A4, Color2, BB = function(A) {
        "use strict";
        _inherits(BB, A);
        var _super = _createSuper(BB);
        function BB() {
            return _classCallCheck(this, BB), _super.apply(this, arguments);
        }
        return BB;
    }(A5);
    Y.BB = BB, Module || (Module = {
    }), A4 = function() {
        "use strict";
        _classCallCheck(this, A4);
    }, (Color2 = Color || (Color = {
    }))[Color2.Blue = 0] = "Blue", Color2[Color2.Red = 1] = "Red", Y.x = 12, Y.F = function(s) {
        return 2;
    }, Y.array = null, Y.fn = function(s) {
        return "hello " + s;
    }, Y.ol = {
        s: "hello",
        id: 2,
        isvalid: !0
    };
})(Y1 || (Y1 = {
}));
