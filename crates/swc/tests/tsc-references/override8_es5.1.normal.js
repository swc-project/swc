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
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
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
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
};
var D = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(D, B);
    var _super = _createSuper(D);
    function D(a, b) {
        _classCallCheck(this, D);
        var _this;
        _this = _super.call(this);
        _this.a = a;
        _this.b = b;
        return _this;
    }
    return D;
}(B);
var BB = function BB(a) {
    "use strict";
    _classCallCheck(this, BB);
    this.a = a;
};
var DD = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(DD, BB);
    var _super = _createSuper(DD);
    function DD(a) {
        _classCallCheck(this, DD);
        var _this;
        _this = _super.call(this, a);
        _this.a = a;
        return _this;
    }
    return DD;
}(BB);
var DDD = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(DDD, BB);
    var _super = _createSuper(DDD);
    function DDD(a) {
        _classCallCheck(this, DDD);
        var _this;
        _this = _super.call(this, a);
        _this.a = a;
        return _this;
    }
    return DDD;
}(BB);
