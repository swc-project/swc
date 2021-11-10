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
var C = /*#__PURE__*/ function(_E) {
    "use strict";
    _inherits(C, _E);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
} // error
(N1.E);
var M1;
(function(M) {
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(D, C);
        var _super = _createSuper(D);
        function D() {
            _classCallCheck(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C);
    M.D = D;
})(M1 || (M1 = {
}));
var N1;
(function(N) {
    var E = /*#__PURE__*/ function(_D) {
        "use strict";
        _inherits(E, _D);
        var _super = _createSuper(E);
        function E() {
            _classCallCheck(this, E);
            return _super.apply(this, arguments);
        }
        return E;
    }(M1.D);
    N.E = E;
})(N1 || (N1 = {
}));
var O;
(function(O) {
    var C2 = /*#__PURE__*/ function(_E2) {
        "use strict";
        _inherits(C2, _E2);
        var _super = _createSuper(C2);
        function C2() {
            _classCallCheck(this, C2);
            return _super.apply(this, arguments);
        }
        return C2;
    } // error
    (Q1.E2);
    var P1;
    (function(P) {
        var D2 = /*#__PURE__*/ function(C2) {
            "use strict";
            _inherits(D2, C2);
            var _super = _createSuper(D2);
            function D2() {
                _classCallCheck(this, D2);
                return _super.apply(this, arguments);
            }
            return D2;
        }(C2);
        P.D2 = D2;
    })(P1 || (P1 = {
    }));
    var Q1;
    (function(Q) {
        var E2 = /*#__PURE__*/ function(_D2) {
            "use strict";
            _inherits(E2, _D2);
            var _super = _createSuper(E2);
            function E2() {
                _classCallCheck(this, E2);
                return _super.apply(this, arguments);
            }
            return E2;
        }(P1.D2);
        Q.E2 = E2;
    })(Q1 || (Q1 = {
    }));
})(O || (O = {
}));
