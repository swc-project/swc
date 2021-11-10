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
var A1 = function() {
    "use strict";
    _classCallCheck(this, A1);
}, B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B() {
        return _classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B;
}(A1), C = function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _createSuper(C);
    function C() {
        return _classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C;
}(A1), AA1 = function() {
    "use strict";
    _classCallCheck(this, AA1);
}, BB = function(AA) {
    "use strict";
    _inherits(BB, AA);
    var _super = _createSuper(BB);
    function BB() {
        return _classCallCheck(this, BB), _super.apply(this, arguments);
    }
    return BB;
}(AA1), CC = function(AA) {
    "use strict";
    _inherits(CC, AA);
    var _super = _createSuper(CC);
    function CC() {
        return _classCallCheck(this, CC), _super.apply(this, arguments);
    }
    return CC;
}(AA1), DD = function(BB) {
    "use strict";
    _inherits(DD, BB);
    var _super = _createSuper(DD);
    function DD() {
        return _classCallCheck(this, DD), _super.apply(this, arguments);
    }
    return DD;
}(BB), EE = function(BB) {
    "use strict";
    _inherits(EE, BB);
    var _super = _createSuper(EE);
    function EE() {
        return _classCallCheck(this, EE), _super.apply(this, arguments);
    }
    return EE;
}(BB), FF = function(CC) {
    "use strict";
    _inherits(FF, CC);
    var _super = _createSuper(FF);
    function FF() {
        return _classCallCheck(this, FF), _super.apply(this, arguments);
    }
    return FF;
}(CC), GG = function(CC) {
    "use strict";
    _inherits(GG, CC);
    var _super = _createSuper(GG);
    function GG() {
        return _classCallCheck(this, GG), _super.apply(this, arguments);
    }
    return GG;
}(CC);
