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
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
var D1 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D1, C3);
    function D1() {
        _classCallCheck(this, D1);
        return _possibleConstructorReturn(this, _getPrototypeOf(D1).apply(this, arguments));
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
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {
}));
function f() {
}
(function(f) {
    f.bar = 1;
})(f || (f = {
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
function f2(x, y) {
    var f17 = function f17(a) {
        var r17 = true ? x : a;
        var r17 = true ? a : x;
    };
    var f18 = function f18(a) {
        var r18 = true ? x : a;
        var r18 = true ? a : x;
    };
    var r0 = true ? x : null;
    var r0 = true ? null : x;
    var u;
    var r0b = true ? u : x;
    var r0b = true ? x : u;
    var r1 = true ? 1 : x;
    var r1 = true ? x : 1;
    var r2 = true ? '' : x;
    var r2 = true ? x : '';
    var r3 = true ? true : x;
    var r3 = true ? x : true;
    var r4 = true ? new Date() : x;
    var r4 = true ? x : new Date();
    var r5 = true ? /1/ : x;
    var r5 = true ? x : /1/;
    var r6 = true ? {
        foo: 1
    } : x;
    var r6 = true ? x : {
        foo: 1
    };
    var r7 = true ? function() {
    } : x;
    var r7 = true ? x : function() {
    };
    var r8 = true ? function(x) {
        return x;
    } : x;
    var r8b = true ? x : function(x) {
        return x;
    }; // type parameters not identical across declarations
    var i1;
    var r9 = true ? i1 : x;
    var r9 = true ? x : i1;
    var c1;
    var r10 = true ? c1 : x;
    var r10 = true ? x : c1;
    var c2;
    var r12 = true ? c2 : x;
    var r12 = true ? x : c2;
    var r13 = true ? E : x;
    var r13 = true ? x : E;
    var r14 = true ? E.A : x;
    var r14 = true ? x : E.A;
    var af;
    var r15 = true ? af : x;
    var r15 = true ? x : af;
    var ac;
    var r16 = true ? ac : x;
    var r16 = true ? x : ac;
    var r19 = true ? new Object() : x; // BCT is Object
    var r19 = true ? x : new Object(); // BCT is Object
    var r20 = true ? {
    } : x; // ok
    var r20 = true ? x : {
    }; // ok
}
