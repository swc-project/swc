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
var NonGeneric;
(function(NonGeneric) {
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(D, C);
        function D() {
            _classCallCheck(this, D);
            return _possibleConstructorReturn(this, _getPrototypeOf(D).apply(this, arguments));
        }
        return D;
    }(C);
    var r = C.prototype;
    r.foo;
    var r2 = D.prototype;
    r2.bar;
})(NonGeneric || (NonGeneric = {
}));
var Generic;
(function(Generic) {
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(D, C);
        function D() {
            _classCallCheck(this, D);
            return _possibleConstructorReturn(this, _getPrototypeOf(D).apply(this, arguments));
        }
        return D;
    }(C);
    var r = C.prototype; // C<any, any>
    var ra = r.foo; // any
    var r2 = D.prototype; // D<any, any>
    var rb = r2.baz; // any
})(Generic || (Generic = {
}));
