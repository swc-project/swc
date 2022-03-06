import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
export var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
export var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
B.cat = "cat";
export var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.Cls = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
};
export var D = function D(a, b) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
/**
 * @template T,U
 */ export var E = /*#__PURE__*/ function() {
    "use strict";
    function E(a, b) {
        swcHelpers.classCallCheck(this, E);
        this.initializedField = 12;
    }
    swcHelpers.createClass(E, [
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
        swcHelpers.classCallCheck(this, F);
    }
    /**
     * @template A,B
     * @param {A} a
     * @param {B} b
     */ F.create = function create(a, b) {
        return new F(a, b);
    };
    return F;
}();
var G = function G() {
    "use strict";
    swcHelpers.classCallCheck(this, G);
};
export { G };
var HH = function HH() {
    "use strict";
    swcHelpers.classCallCheck(this, HH);
};
export { HH as H };
export var I = function I() {
    "use strict";
    swcHelpers.classCallCheck(this, I);
};
export { I as II };
export { J as JJ };
export var J = function J() {
    "use strict";
    swcHelpers.classCallCheck(this, J);
};
export var K = /*#__PURE__*/ function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K);
        this.p1 = 12;
        this.p2 = "ok";
    }
    var _proto = K.prototype;
    _proto.method = function method() {
        return this.p1;
    };
    return K;
}();
export var L = /*#__PURE__*/ function(K) {
    "use strict";
    swcHelpers.inherits(L, K);
    var _super = swcHelpers.createSuper(L);
    function L() {
        swcHelpers.classCallCheck(this, L);
        return _super.apply(this, arguments);
    }
    return L;
}(K);
export var M = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(M, _superClass);
    var _super = swcHelpers.createSuper(M);
    function M() {
        swcHelpers.classCallCheck(this, M);
        var _this;
        _this.prop = 12;
        return swcHelpers.possibleConstructorReturn(_this);
    }
    return M;
}(null);
/**
 * @template T
 */ export var N = /*#__PURE__*/ function(L) {
    "use strict";
    swcHelpers.inherits(N, L);
    var _super = swcHelpers.createSuper(N);
    function N(param) {
        swcHelpers.classCallCheck(this, N);
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
    swcHelpers.inherits(O, N);
    var _super = swcHelpers.createSuper(O);
    function O(param) {
        swcHelpers.classCallCheck(this, O);
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
    swcHelpers.inherits(VariableBase, x1);
    var _super = swcHelpers.createSuper(VariableBase);
    function VariableBase() {
        swcHelpers.classCallCheck(this, VariableBase);
        return _super.apply(this, arguments);
    }
    return VariableBase;
}(x);
export var HasStatics = /*#__PURE__*/ function() {
    "use strict";
    function HasStatics() {
        swcHelpers.classCallCheck(this, HasStatics);
    }
    HasStatics.staticMethod = function staticMethod() {};
    return HasStatics;
}();
export var ExtendsStatics = /*#__PURE__*/ function(HasStatics) {
    "use strict";
    swcHelpers.inherits(ExtendsStatics, HasStatics);
    var _super = swcHelpers.createSuper(ExtendsStatics);
    function ExtendsStatics() {
        swcHelpers.classCallCheck(this, ExtendsStatics);
        return _super.apply(this, arguments);
    }
    ExtendsStatics.also = function also() {};
    return ExtendsStatics;
}(HasStatics);
