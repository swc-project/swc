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
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B() {
        _classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(A);
var AA = function AA() {
    "use strict";
    _classCallCheck(this, AA);
};
var BB = /*#__PURE__*/ function(AA) {
    "use strict";
    _inherits(BB, AA);
    var _super = _createSuper(BB);
    function BB() {
        _classCallCheck(this, BB);
        return _super.apply(this, arguments);
    }
    return BB;
}(AA);
var CC = /*#__PURE__*/ function(AA) {
    "use strict";
    _inherits(CC, AA);
    var _super = _createSuper(CC);
    function CC() {
        _classCallCheck(this, CC);
        return _super.apply(this, arguments);
    }
    return CC;
}(AA);
var DD = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(DD, BB);
    var _super = _createSuper(DD);
    function DD() {
        _classCallCheck(this, DD);
        return _super.apply(this, arguments);
    }
    return DD;
}(BB);
var EE = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(EE, BB);
    var _super = _createSuper(EE);
    function EE() {
        _classCallCheck(this, EE);
        return _super.apply(this, arguments);
    }
    return EE;
}(BB);
var FF = /*#__PURE__*/ function(CC) {
    "use strict";
    _inherits(FF, CC);
    var _super = _createSuper(FF);
    function FF() {
        _classCallCheck(this, FF);
        return _super.apply(this, arguments);
    }
    return FF;
}(CC);
var GG = /*#__PURE__*/ function(CC) {
    "use strict";
    _inherits(GG, CC);
    var _super = _createSuper(GG);
    function GG() {
        _classCallCheck(this, GG);
        return _super.apply(this, arguments);
    }
    return GG;
}(CC);
