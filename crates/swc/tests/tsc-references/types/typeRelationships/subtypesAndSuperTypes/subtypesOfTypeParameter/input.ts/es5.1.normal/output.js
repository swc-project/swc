function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
var D1 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D1, C3);
    var _super = _createSuper(D1);
    function D1() {
        _classCallCheck(this, D1);
        return _super.apply(this, arguments);
    }
    return D1;
}(C3);
function f1(x, y) {
    var r = true ? x : y; // error
    var r = true ? y : x; // error
}
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
var C2 = function C2() {
    "use strict";
    _classCallCheck(this, C2);
};
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
function f3() {
}
(function(f) {
    f.bar = 1;
})(f3 || (f3 = {
}));
var c = function c() {
    "use strict";
    _classCallCheck(this, c);
};
(function(c) {
    c.bar = 1;
})(c || (c = {
}));
// errors throughout
function f2(x1, y) {
    var f17 = function f17(a) {
        var r17 = true ? x1 : a;
        var r17 = true ? a : x1;
    };
    var f18 = function f18(a) {
        var r18 = true ? x1 : a;
        var r18 = true ? a : x1;
    };
    var r0 = true ? x1 : null;
    var r0 = true ? null : x1;
    var u;
    var r0b = true ? u : x1;
    var r0b = true ? x1 : u;
    var r1 = true ? 1 : x1;
    var r1 = true ? x1 : 1;
    var r2 = true ? '' : x1;
    var r2 = true ? x1 : '';
    var r3 = true ? true : x1;
    var r3 = true ? x1 : true;
    var r4 = true ? new Date() : x1;
    var r4 = true ? x1 : new Date();
    var r5 = true ? /1/ : x1;
    var r5 = true ? x1 : /1/;
    var r6 = true ? {
        foo: 1
    } : x1;
    var r6 = true ? x1 : {
        foo: 1
    };
    var r7 = true ? function() {
    } : x1;
    var r7 = true ? x1 : function() {
    };
    var r8 = true ? function(x) {
        return x;
    } : x1;
    var r8b = true ? x1 : function(x) {
        return x;
    }; // type parameters not identical across declarations
    var i1;
    var r9 = true ? i1 : x1;
    var r9 = true ? x1 : i1;
    var c1;
    var r10 = true ? c1 : x1;
    var r10 = true ? x1 : c1;
    var c2;
    var r12 = true ? c2 : x1;
    var r12 = true ? x1 : c2;
    var r13 = true ? E1 : x1;
    var r13 = true ? x1 : E1;
    var r14 = true ? E1.A : x1;
    var r14 = true ? x1 : E1.A;
    var af;
    var r15 = true ? af : x1;
    var r15 = true ? x1 : af;
    var ac;
    var r16 = true ? ac : x1;
    var r16 = true ? x1 : ac;
    var r19 = true ? new Object() : x1; // BCT is Object
    var r19 = true ? x1 : new Object(); // BCT is Object
    var r20 = true ? {
    } : x1; // ok
    var r20 = true ? x1 : {
    }; // ok
}
