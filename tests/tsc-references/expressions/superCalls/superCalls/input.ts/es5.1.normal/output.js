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
var Base = function Base(n) {
    "use strict";
    _classCallCheck(this, Base);
    this.x = 43;
};
function v() {
}
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived(q) {
        _classCallCheck(this, Derived);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Derived).call(this, ''));
        _this.q = q;
        var _temp;
        //type of super call expression is void
        var p = (_temp = _this = _possibleConstructorReturn(this, _getPrototypeOf(Derived).call(this, '')), _this.q = q, _temp);
        var p = v();
        return _this;
    }
    return Derived;
}(Base);
var OtherBase = function OtherBase() {
    "use strict";
    _classCallCheck(this, OtherBase);
};
var OtherDerived = /*#__PURE__*/ function(OtherBase) {
    "use strict";
    _inherits(OtherDerived, OtherBase);
    function OtherDerived() {
        _classCallCheck(this, OtherDerived);
        var p = '';
        return _possibleConstructorReturn(this, _getPrototypeOf(OtherDerived).call(this));
    }
    return OtherDerived;
}(OtherBase);
