import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _possible_constructor_return from "@swc/helpers/lib/_possible_constructor_return.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
export var A = function() {
    "use strict";
    _class_call_check(this, A);
};
export var B = function() {
    "use strict";
    _class_call_check(this, B);
};
B.cat = "cat";
export var C = function() {
    "use strict";
    _class_call_check(this, C);
};
C.Cls = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
export var D = function(a, b) {
    "use strict";
    _class_call_check(this, D);
};
export var E = function() {
    "use strict";
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
export var F = function() {
    "use strict";
    function F(a, b) {
        _class_call_check(this, F);
    }
    return F.create = function(a, b) {
        return new F(a, b);
    }, F;
}();
var G = function() {
    "use strict";
    _class_call_check(this, G);
};
var HH = function() {
    "use strict";
    _class_call_check(this, HH);
};
export var I = function() {
    "use strict";
    _class_call_check(this, I);
};
export var J = function J() {
    "use strict";
    _class_call_check(this, J);
};
export var K = function() {
    "use strict";
    function K() {
        _class_call_check(this, K), this.p1 = 12, this.p2 = "ok";
    }
    return K.prototype.method = function() {
        return this.p1;
    }, K;
}();
export var L = function(K) {
    "use strict";
    _inherits(L, K);
    var _super = _create_super(L);
    function L() {
        return _class_call_check(this, L), _super.apply(this, arguments);
    }
    return L;
}(K);
export var M = function(_superClass) {
    "use strict";
    function M() {
        var _this;
        return _class_call_check(this, M), _this.prop = 12, _possible_constructor_return(_this);
    }
    return _inherits(M, null), _create_super(M), M;
}(null);
export var N = function(L) {
    "use strict";
    _inherits(N, L);
    var _super = _create_super(N);
    function N(param) {
        var _this;
        return _class_call_check(this, N), (_this = _super.call(this)).another = param, _this;
    }
    return N;
}(L);
export var O = function(N) {
    "use strict";
    _inherits(O, N);
    var _super = _create_super(O);
    function O(param) {
        var _this;
        return _class_call_check(this, O), (_this = _super.call(this, param)).another2 = param, _this;
    }
    return O;
}(N);
export var VariableBase = function(x) {
    "use strict";
    _inherits(VariableBase, null);
    var _super = _create_super(VariableBase);
    function VariableBase() {
        return _class_call_check(this, VariableBase), _super.apply(this, arguments);
    }
    return VariableBase;
}(null);
export var HasStatics = function() {
    "use strict";
    function HasStatics() {
        _class_call_check(this, HasStatics);
    }
    return HasStatics.staticMethod = function() {}, HasStatics;
}();
export var ExtendsStatics = function(HasStatics) {
    "use strict";
    _inherits(ExtendsStatics, HasStatics);
    var _super = _create_super(ExtendsStatics);
    function ExtendsStatics() {
        return _class_call_check(this, ExtendsStatics), _super.apply(this, arguments);
    }
    return ExtendsStatics.also = function() {}, ExtendsStatics;
}(HasStatics);
export { G, HH as H, I as II, J as JJ };
