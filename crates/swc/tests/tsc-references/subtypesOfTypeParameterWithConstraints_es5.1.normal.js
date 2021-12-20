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
var D2 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D2, C3);
    var _super = _createSuper(D2);
    function D2() {
        _classCallCheck(this, D2);
        return _super.apply(this, arguments);
    }
    return D2;
}(C3);
var D3 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D3, C3);
    var _super = _createSuper(D3);
    function D3() {
        _classCallCheck(this, D3);
        return _super.apply(this, arguments);
    }
    return D3;
}(C3);
var D4 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D4, C3);
    var _super = _createSuper(D4);
    function D4() {
        _classCallCheck(this, D4);
        return _super.apply(this, arguments);
    }
    return D4;
}(C3);
var D5 = // V > U > T
// test if T is subtype of T, U, V
// should all work
/*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D5, C3);
    var _super = _createSuper(D5);
    function D5() {
        _classCallCheck(this, D5);
        return _super.apply(this, arguments);
    }
    return D5;
}(C3);
var D6 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D6, C3);
    var _super = _createSuper(D6);
    function D6() {
        _classCallCheck(this, D6);
        return _super.apply(this, arguments);
    }
    return D6;
}(C3);
var D7 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D7, C3);
    var _super = _createSuper(D7);
    function D7() {
        _classCallCheck(this, D7);
        return _super.apply(this, arguments);
    }
    return D7;
}(C3);
var D8 = // test if U is a subtype of T, U, V
// only a subtype of V and itself
/*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D8, C3);
    var _super = _createSuper(D8);
    function D8() {
        _classCallCheck(this, D8);
        return _super.apply(this, arguments);
    }
    return D8;
}(C3);
var D9 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D9, C3);
    var _super = _createSuper(D9);
    function D9() {
        _classCallCheck(this, D9);
        return _super.apply(this, arguments);
    }
    return D9;
}(C3);
var D10 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D10, C3);
    var _super = _createSuper(D10);
    function D10() {
        _classCallCheck(this, D10);
        return _super.apply(this, arguments);
    }
    return D10;
}(C3);
var D11 = // test if V is a subtype of T, U, V
// only a subtype of itself
/*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D11, C3);
    var _super = _createSuper(D11);
    function D11() {
        _classCallCheck(this, D11);
        return _super.apply(this, arguments);
    }
    return D11;
}(C3);
var D12 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D12, C3);
    var _super = _createSuper(D12);
    function D12() {
        _classCallCheck(this, D12);
        return _super.apply(this, arguments);
    }
    return D12;
}(C3);
var D13 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D13, C3);
    var _super = _createSuper(D13);
    function D13() {
        _classCallCheck(this, D13);
        return _super.apply(this, arguments);
    }
    return D13;
}(C3);
var D14 = // Date > V > U > T
// test if T is subtype of T, U, V, Date
// should all work
/*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D14, C3);
    var _super = _createSuper(D14);
    function D14() {
        _classCallCheck(this, D14);
        return _super.apply(this, arguments);
    }
    return D14;
}(C3);
var D15 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D15, C3);
    var _super = _createSuper(D15);
    function D15() {
        _classCallCheck(this, D15);
        return _super.apply(this, arguments);
    }
    return D15;
}(C3);
var D16 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D16, C3);
    var _super = _createSuper(D16);
    function D16() {
        _classCallCheck(this, D16);
        return _super.apply(this, arguments);
    }
    return D16;
}(C3);
var D17 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D17, C3);
    var _super = _createSuper(D17);
    function D17() {
        _classCallCheck(this, D17);
        return _super.apply(this, arguments);
    }
    return D17;
}(C3);
var D18 = // test if U is a subtype of T, U, V, Date
// only a subtype of V, Date and itself
/*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D18, C3);
    var _super = _createSuper(D18);
    function D18() {
        _classCallCheck(this, D18);
        return _super.apply(this, arguments);
    }
    return D18;
}(C3);
var D19 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D19, C3);
    var _super = _createSuper(D19);
    function D19() {
        _classCallCheck(this, D19);
        return _super.apply(this, arguments);
    }
    return D19;
}(C3);
var D20 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D20, C3);
    var _super = _createSuper(D20);
    function D20() {
        _classCallCheck(this, D20);
        return _super.apply(this, arguments);
    }
    return D20;
}(C3);
var D21 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D21, C3);
    var _super = _createSuper(D21);
    function D21() {
        _classCallCheck(this, D21);
        return _super.apply(this, arguments);
    }
    return D21;
}(C3);
var D22 = // test if V is a subtype of T, U, V, Date
// only a subtype of itself and Date
/*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D22, C3);
    var _super = _createSuper(D22);
    function D22() {
        _classCallCheck(this, D22);
        return _super.apply(this, arguments);
    }
    return D22;
}(C3);
var D23 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D23, C3);
    var _super = _createSuper(D23);
    function D23() {
        _classCallCheck(this, D23);
        return _super.apply(this, arguments);
    }
    return D23;
}(C3);
var D24 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D24, C3);
    var _super = _createSuper(D24);
    function D24() {
        _classCallCheck(this, D24);
        return _super.apply(this, arguments);
    }
    return D24;
}(C3);
var D25 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D25, C3);
    var _super = _createSuper(D25);
    function D25() {
        _classCallCheck(this, D25);
        return _super.apply(this, arguments);
    }
    return D25;
}(C3);
var D26 = // test if Date is a subtype of T, U, V, Date
// only a subtype of itself
/*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D26, C3);
    var _super = _createSuper(D26);
    function D26() {
        _classCallCheck(this, D26);
        return _super.apply(this, arguments);
    }
    return D26;
}(C3);
var D27 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D27, C3);
    var _super = _createSuper(D27);
    function D27() {
        _classCallCheck(this, D27);
        return _super.apply(this, arguments);
    }
    return D27;
}(C3);
var D28 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D28, C3);
    var _super = _createSuper(D28);
    function D28() {
        _classCallCheck(this, D28);
        return _super.apply(this, arguments);
    }
    return D28;
}(C3);
var D29 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D29, C3);
    var _super = _createSuper(D29);
    function D29() {
        _classCallCheck(this, D29);
        return _super.apply(this, arguments);
    }
    return D29;
}(C3);
