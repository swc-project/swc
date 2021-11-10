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
var E1, E2, E11, A1 = function() {
    "use strict";
    _classCallCheck(this, A1), this.a = 10;
}, C = function() {
    "use strict";
    _classCallCheck(this, C);
}, D = function() {
    "use strict";
    _classCallCheck(this, D);
}, E = function(A) {
    "use strict";
    _inherits(E, A);
    var _super = _createSuper(E);
    function E() {
        return _classCallCheck(this, E), _super.apply(this, arguments);
    }
    return E;
}(A1), F = function(A) {
    "use strict";
    _inherits(F, A);
    var _super = _createSuper(F);
    function F() {
        return _classCallCheck(this, F), _super.apply(this, arguments);
    }
    return F;
}(A1);
(E11 = E1 || (E1 = {
}))[E11.one = 0] = "one", (E21 = E2 || (E2 = {
}))[E21.one = 0] = "one";
var E21, classCDATuple = [
    new C(),
    new D()
];
classCDATuple[2], classCDATuple[5], E1.one, E2.one, new C(), new C(), new D(), t4[2] = 10;
