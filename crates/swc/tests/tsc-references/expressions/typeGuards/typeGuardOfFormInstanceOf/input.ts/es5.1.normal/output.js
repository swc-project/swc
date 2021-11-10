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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
var C2 = function C2() {
    "use strict";
    _classCallCheck(this, C2);
};
var D1 = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(D1, C1);
    var _super = _createSuper(D1);
    function D1() {
        _classCallCheck(this, D1);
        return _super.apply(this, arguments);
    }
    return D1;
}(C1);
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
var str;
var num;
var strOrNum;
var ctor1;
str = _instanceof(ctor1, C1) && ctor1.p1; // C1
num = _instanceof(ctor1, C2) && ctor1.p2; // C2
str = _instanceof(ctor1, D1) && ctor1.p1; // D1
num = _instanceof(ctor1, D1) && ctor1.p3; // D1
var ctor2;
num = _instanceof(ctor2, C2) && ctor2.p2; // C2
num = _instanceof(ctor2, D1) && ctor2.p3; // D1
str = _instanceof(ctor2, D1) && ctor2.p1; // D1
var r2 = _instanceof(ctor2, C1) && ctor2; // C2 | D1
var ctor3;
if (_instanceof(ctor3, C1)) {
    ctor3.p1; // C1
} else {
    ctor3.p2; // C2
}
var ctor4;
if (_instanceof(ctor4, C1)) {
    ctor4.p1; // C1
} else if (_instanceof(ctor4, C2)) {
    ctor4.p2; // C2
} else {
    ctor4.p4; // C3
}
var ctor5;
if (_instanceof(ctor5, C1)) {
    ctor5.p1; // C1
} else {
    ctor5.p2; // C2
}
var ctor6;
if (_instanceof(ctor6, C1) || _instanceof(ctor6, C2)) {
} else {
    ctor6.p4; // C3
}
