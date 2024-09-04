//// [index.js]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
B.cat = "cat";
export var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.Cls = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
export var D = function D(a, b) {
    "use strict";
    _class_call_check(this, D);
};
/**
 * @template T,U
 */ export var E = /*#__PURE__*/ function() {
    "use strict";
    function E(a, b) {
        _class_call_check(this, E);
        this.initializedField = 12;
    }
    _create_class(E, [
        {
            key: "f1",
            get: /**
     * @return {U}
     */ function get() {
                return /** @type {*} */ null;
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
                return /** @type {*} */ null;
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
        _class_call_check(this, F);
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
    _class_call_check(this, G);
};
export { G };
var HH = function HH() {
    "use strict";
    _class_call_check(this, HH);
};
export { HH as H };
export var I = function I() {
    "use strict";
    _class_call_check(this, I);
};
export { I as II };
export { J as JJ };
export var J = function J() {
    "use strict";
    _class_call_check(this, J);
};
export var K = /*#__PURE__*/ function() {
    "use strict";
    function K() {
        _class_call_check(this, K);
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
    _inherits(L, K);
    function L() {
        _class_call_check(this, L);
        return _call_super(this, L, arguments);
    }
    return L;
}(K);
export var M = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(M, _superClass);
    function M() {
        _class_call_check(this, M);
        var _this;
        _assert_this_initialized(_this).prop = 12;
        return _assert_this_initialized(_this);
    }
    return M;
}(null);
/**
 * @template T
 */ export var N = /*#__PURE__*/ function(L) {
    "use strict";
    _inherits(N, L);
    function N(param) {
        _class_call_check(this, N);
        var _this;
        _this = _call_super(this, N);
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
    function O(param) {
        _class_call_check(this, O);
        var _this;
        _this = _call_super(this, O, [
            param
        ]);
        _this.another2 = param;
        return _this;
    }
    return O;
}(N);
var x = /** @type {*} */ null;
export var VariableBase = /*#__PURE__*/ function(x) {
    "use strict";
    _inherits(VariableBase, x);
    function VariableBase() {
        _class_call_check(this, VariableBase);
        return _call_super(this, VariableBase, arguments);
    }
    return VariableBase;
}(x);
export var HasStatics = /*#__PURE__*/ function() {
    "use strict";
    function HasStatics() {
        _class_call_check(this, HasStatics);
    }
    HasStatics.staticMethod = function staticMethod() {};
    return HasStatics;
}();
export var ExtendsStatics = /*#__PURE__*/ function(HasStatics) {
    "use strict";
    _inherits(ExtendsStatics, HasStatics);
    function ExtendsStatics() {
        _class_call_check(this, ExtendsStatics);
        return _call_super(this, ExtendsStatics, arguments);
    }
    ExtendsStatics.also = function also() {};
    return ExtendsStatics;
}(HasStatics);
