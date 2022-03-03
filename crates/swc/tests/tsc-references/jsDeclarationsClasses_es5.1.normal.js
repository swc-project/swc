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
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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
export var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
export var B = function B() {
    "use strict";
    _classCallCheck(this, B);
};
B.cat = "cat";
export var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
C.Cls = function _class() {
    "use strict";
    _classCallCheck(this, _class);
};
export var D = function D(a, b) {
    "use strict";
    _classCallCheck(this, D);
};
/**
 * @template T,U
 */ export var E = /*#__PURE__*/ function() {
    "use strict";
    function E(a, b) {
        _classCallCheck(this, E);
        this.initializedField = 12;
    }
    _createClass(E, [
        {
            key: "f1",
            get: /**
     * @return {U}
     */ function get() {
                return(/** @type {*} */ (null));
            },
            set: /**
     * @param {U} _p
     */ function set(_p) {}
        },
        {
            key: "f2",
            get: /**
     * @return {U}
     */ function get() {
                return(/** @type {*} */ (null));
            }
        },
        {
            key: "f3",
            set: /**
     * @param {U} _p
     */ function set(_p) {}
        }
    ], [
        {
            key: "s1",
            get: /**
     * @return {string}
     */ function get() {
                return "";
            },
            set: /**
     * @param {string} _p
     */ function set(_p) {}
        },
        {
            key: "s2",
            get: /**
     * @return {string}
     */ function get() {
                return "";
            }
        },
        {
            key: "s3",
            set: /**
     * @param {string} _p
     */ function set(_p) {}
        }
    ]);
    return E;
}();
E.staticInitializedField = 12;
/**
 * @template T,U
 */ export var F = /*#__PURE__*/ function() {
    "use strict";
    function F(a, b) {
        _classCallCheck(this, F);
    }
    _createClass(F, null, [
        {
            key: "create",
            value: /**
     * @template A,B
     * @param {A} a
     * @param {B} b
     */ function create(a, b) {
                return new F(a, b);
            }
        }
    ]);
    return F;
}();
var G = function G() {
    "use strict";
    _classCallCheck(this, G);
};
export { G };
var HH = function HH() {
    "use strict";
    _classCallCheck(this, HH);
};
export { HH as H };
export var I = function I() {
    "use strict";
    _classCallCheck(this, I);
};
export { I as II };
export { J as JJ };
export var J = function J() {
    "use strict";
    _classCallCheck(this, J);
};
export var K = /*#__PURE__*/ function() {
    "use strict";
    function K() {
        _classCallCheck(this, K);
        this.p1 = 12;
        this.p2 = "ok";
    }
    _createClass(K, [
        {
            key: "method",
            value: function method() {
                return this.p1;
            }
        }
    ]);
    return K;
}();
export var L = /*#__PURE__*/ function(K) {
    "use strict";
    _inherits(L, K);
    var _super = _createSuper(L);
    function L() {
        _classCallCheck(this, L);
        return _super.apply(this, arguments);
    }
    return L;
}(K);
export var M = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(M, _superClass);
    var _super = _createSuper(M);
    function M() {
        _classCallCheck(this, M);
        var _this;
        _this.prop = 12;
        return _possibleConstructorReturn(_this);
    }
    return M;
}(null);
/**
 * @template T
 */ export var N = /*#__PURE__*/ function(L) {
    "use strict";
    _inherits(N, L);
    var _super = _createSuper(N);
    function N(param) {
        _classCallCheck(this, N);
        var _this;
        _this = _super.call(this);
        _this.another = param;
        return _this;
    }
    return N;
}(L);
/**
 * @template U
 * @extends {N<U>}
 */ export var O = /*#__PURE__*/ function(N) {
    "use strict";
    _inherits(O, N);
    var _super = _createSuper(O);
    function O(param) {
        _classCallCheck(this, O);
        var _this;
        _this = _super.call(this, param);
        _this.another2 = param;
        return _this;
    }
    return O;
}(N);
var x = /** @type {*} */ (null);
export var VariableBase = /*#__PURE__*/ function(x1) {
    "use strict";
    _inherits(VariableBase, x1);
    var _super = _createSuper(VariableBase);
    function VariableBase() {
        _classCallCheck(this, VariableBase);
        return _super.apply(this, arguments);
    }
    return VariableBase;
}(x);
export var HasStatics = /*#__PURE__*/ function() {
    "use strict";
    function HasStatics() {
        _classCallCheck(this, HasStatics);
    }
    _createClass(HasStatics, null, [
        {
            key: "staticMethod",
            value: function staticMethod() {}
        }
    ]);
    return HasStatics;
}();
export var ExtendsStatics = /*#__PURE__*/ function(HasStatics) {
    "use strict";
    _inherits(ExtendsStatics, HasStatics);
    var _super = _createSuper(ExtendsStatics);
    function ExtendsStatics() {
        _classCallCheck(this, ExtendsStatics);
        return _super.apply(this, arguments);
    }
    _createClass(ExtendsStatics, null, [
        {
            key: "also",
            value: function also() {}
        }
    ]);
    return ExtendsStatics;
}(HasStatics);
