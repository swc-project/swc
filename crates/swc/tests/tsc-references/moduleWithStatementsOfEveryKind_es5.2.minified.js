var A, Y;
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
!function(A3) {
    var Module, Color, A1, Color, A2 = function() {
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
    }(AA1), BB = function(A4) {
        "use strict";
        _inherits(BB, A4);
        var _super = _createSuper(BB);
        function BB() {
            return _classCallCheck(this, BB), _super.apply(this, arguments);
        }
        return BB;
    }(A2);
    Module || (Module = {}), A1 = function() {
        "use strict";
        _classCallCheck(this, A1);
    }, (Color = Color || (Color = {}))[Color.Blue = 0] = "Blue", Color[Color.Red = 1] = "Red";
}(A || (A = {})), (function(Y1) {
    var Color, A6 = function() {
        "use strict";
        _classCallCheck(this, A6);
    };
    Y1.A = A6;
    var AA2 = function() {
        "use strict";
        _classCallCheck(this, AA2);
    };
    Y1.AA = AA2;
    var B = function(AA) {
        "use strict";
        _inherits(B, AA);
        var _super = _createSuper(B);
        function B() {
            return _classCallCheck(this, B), _super.apply(this, arguments);
        }
        return B;
    }(AA2);
    Y1.B = B;
    var A5, Color, BB = function(A7) {
        "use strict";
        _inherits(BB, A7);
        var _super = _createSuper(BB);
        function BB() {
            return _classCallCheck(this, BB), _super.apply(this, arguments);
        }
        return BB;
    }(A6);
    Y1.BB = BB, Y1.Module || (Y1.Module = {}), A5 = function() {
        "use strict";
        _classCallCheck(this, A5);
    }, (Color = Color = Y1.Color || (Y1.Color = {}))[Color.Blue = 0] = "Blue", Color[Color.Red = 1] = "Red", Y1.x = 12, Y1.F = function(s) {
        return 2;
    }, Y1.array = null, Y1.fn = function(s) {
        return "hello " + s;
    }, Y1.ol = {
        s: "hello",
        id: 2,
        isvalid: !0
    };
})(Y || (Y = {}));
