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
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
// Pretty much all of this should be an error, (since index signatures and generics are forbidden in js),
// but we should be able to synthesize declarations from the symbols regardless
export var M = function M() {
    "use strict";
    _classCallCheck(this, M);
};
export var N = /*#__PURE__*/ function(M) {
    "use strict";
    _inherits(N, M);
    var _super = _createSuper(N);
    function N() {
        _classCallCheck(this, N);
        return _super.apply(this, arguments);
    }
    return N;
}(M);
export var O = function O() {
    "use strict";
    _classCallCheck(this, O);
};
export var P = /*#__PURE__*/ function(O) {
    "use strict";
    _inherits(P, O);
    var _super = _createSuper(P);
    function P() {
        _classCallCheck(this, P);
        return _super.apply(this, arguments);
    }
    return P;
}(O);
export var Q = /*#__PURE__*/ function(O) {
    "use strict";
    _inherits(Q, O);
    var _super = _createSuper(Q);
    function Q() {
        _classCallCheck(this, Q);
        return _super.apply(this, arguments);
    }
    return Q;
}(O);
export var R = /*#__PURE__*/ function(O) {
    "use strict";
    _inherits(R, O);
    var _super = _createSuper(R);
    function R() {
        _classCallCheck(this, R);
        return _super.apply(this, arguments);
    }
    return R;
}(O);
export var S = /*#__PURE__*/ function(O) {
    "use strict";
    _inherits(S, O);
    var _super = _createSuper(S);
    function S() {
        _classCallCheck(this, S);
        return _super.apply(this, arguments);
    }
    return S;
}(O);
export var T = function T() {
    "use strict";
    _classCallCheck(this, T);
};
export var U = /*#__PURE__*/ function(T) {
    "use strict";
    _inherits(U, T);
    var _super = _createSuper(U);
    function U() {
        _classCallCheck(this, U);
        return _super.apply(this, arguments);
    }
    return U;
}(T);
export var V = /*#__PURE__*/ function(T) {
    "use strict";
    _inherits(V, T);
    var _super = _createSuper(V);
    function V() {
        _classCallCheck(this, V);
        return _super.apply(this, arguments);
    }
    return V;
}(T);
export var W = /*#__PURE__*/ function(T) {
    "use strict";
    _inherits(W, T);
    var _super = _createSuper(W);
    function W() {
        _classCallCheck(this, W);
        return _super.apply(this, arguments);
    }
    return W;
}(T);
export var X = /*#__PURE__*/ function(T) {
    "use strict";
    _inherits(X, T);
    var _super = _createSuper(X);
    function X() {
        _classCallCheck(this, X);
        return _super.apply(this, arguments);
    }
    return X;
}(T);
export var Y = function Y() {
    "use strict";
    _classCallCheck(this, Y);
};
export var Z = /*#__PURE__*/ function(Y) {
    "use strict";
    _inherits(Z, Y);
    var _super = _createSuper(Z);
    function Z() {
        _classCallCheck(this, Z);
        return _super.apply(this, arguments);
    }
    return Z;
}(Y);
export var AA = /*#__PURE__*/ function(Y) {
    "use strict";
    _inherits(AA, Y);
    var _super = _createSuper(AA);
    function AA() {
        _classCallCheck(this, AA);
        return _super.apply(this, arguments);
    }
    return AA;
}(Y);
export var BB = /*#__PURE__*/ function(Y) {
    "use strict";
    _inherits(BB, Y);
    var _super = _createSuper(BB);
    function BB() {
        _classCallCheck(this, BB);
        return _super.apply(this, arguments);
    }
    return BB;
}(Y);
export var CC = /*#__PURE__*/ function(Y) {
    "use strict";
    _inherits(CC, Y);
    var _super = _createSuper(CC);
    function CC() {
        _classCallCheck(this, CC);
        return _super.apply(this, arguments);
    }
    return CC;
}(Y);
