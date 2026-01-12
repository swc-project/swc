//// [index.js]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export var A = function A() {
    _class_call_check(this, A);
};
export var B = function B() {
    _class_call_check(this, B);
};
B.cat = "cat";
export var C = function C() {
    _class_call_check(this, C);
};
C.Cls = function _class() {
    _class_call_check(this, _class);
};
export var D = function D(a, b) {
    _class_call_check(this, D);
};
export var E = /*#__PURE__*/ function() {
    function E(a, b) {
        _class_call_check(this, E), this.initializedField = 12;
    }
    return _create_class(E, [
        {
            key: "f1",
            get: function() {
                return null;
            },
            set: function(_p) {}
        },
        {
            key: "f2",
            get: function() {
                return null;
            }
        },
        {
            key: "f3",
            set: function(_p) {}
        }
    ], [
        {
            key: "s1",
            get: function() {
                return "";
            },
            set: function(_p) {}
        },
        {
            key: "s2",
            get: function() {
                return "";
            }
        },
        {
            key: "s3",
            set: function(_p) {}
        }
    ]), E;
}();
E.staticInitializedField = 12;
export var F = /*#__PURE__*/ function() {
    function F(a, b) {
        _class_call_check(this, F);
    }
    return F.create = function(a, b) {
        return new F(a, b);
    }, F;
}();
var G = function G() {
    _class_call_check(this, G);
};
var HH = function HH() {
    _class_call_check(this, HH);
};
export var I = function I() {
    _class_call_check(this, I);
};
export var J = function J() {
    _class_call_check(this, J);
};
export var K = /*#__PURE__*/ function() {
    function K() {
        _class_call_check(this, K), this.p1 = 12, this.p2 = "ok";
    }
    return K.prototype.method = function() {
        return this.p1;
    }, K;
}();
export var L = /*#__PURE__*/ function(K) {
    function L() {
        return _class_call_check(this, L), _call_super(this, L, arguments);
    }
    return _inherits(L, K), L;
}(K);
export var M = /*#__PURE__*/ function(_superClass) {
    function M() {
        var _this;
        return _class_call_check(this, M), _assert_this_initialized(_this).prop = 12, _assert_this_initialized(_this);
    }
    return _inherits(M, null), M;
}(0);
export var N = /*#__PURE__*/ function(L) {
    function N(param) {
        var _this;
        return _class_call_check(this, N), (_this = _call_super(this, N)).another = param, _this;
    }
    return _inherits(N, L), N;
}(L);
export var O = /*#__PURE__*/ function(N) {
    function O(param) {
        var _this;
        return _class_call_check(this, O), (_this = _call_super(this, O, [
            param
        ])).another2 = param, _this;
    }
    return _inherits(O, N), O;
}(N);
export var VariableBase = /*#__PURE__*/ function(x) {
    function VariableBase() {
        return _class_call_check(this, VariableBase), _call_super(this, VariableBase, arguments);
    }
    return _inherits(VariableBase, x), VariableBase;
}(null);
export var HasStatics = /*#__PURE__*/ function() {
    function HasStatics() {
        _class_call_check(this, HasStatics);
    }
    return HasStatics.staticMethod = function() {}, HasStatics;
}();
export var ExtendsStatics = /*#__PURE__*/ function(HasStatics) {
    function ExtendsStatics() {
        return _class_call_check(this, ExtendsStatics), _call_super(this, ExtendsStatics, arguments);
    }
    return _inherits(ExtendsStatics, HasStatics), ExtendsStatics.also = function() {}, ExtendsStatics;
}(HasStatics);
export { G, HH as H, I as II, J as JJ };
