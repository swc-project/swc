import * as swcHelpers from "@swc/helpers";
export var A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
export var B = function() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
B.cat = "cat";
export var C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.Cls = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
};
export var D = function(a, b) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
export var E = function() {
    "use strict";
    function E(a, b) {
        swcHelpers.classCallCheck(this, E), this.initializedField = 12;
    }
    return swcHelpers.createClass(E, [
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
        swcHelpers.classCallCheck(this, F);
    }
    return F.create = function(a, b) {
        return new F(a, b);
    }, F;
}();
var G = function() {
    "use strict";
    swcHelpers.classCallCheck(this, G);
};
var HH = function() {
    "use strict";
    swcHelpers.classCallCheck(this, HH);
};
export var I = function() {
    "use strict";
    swcHelpers.classCallCheck(this, I);
};
export var J = function J() {
    "use strict";
    swcHelpers.classCallCheck(this, J);
};
export var K = function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K), this.p1 = 12, this.p2 = "ok";
    }
    return K.prototype.method = function() {
        return this.p1;
    }, K;
}();
export var L = function(K) {
    "use strict";
    swcHelpers.inherits(L, K);
    var _super = swcHelpers.createSuper(L);
    function L() {
        return swcHelpers.classCallCheck(this, L), _super.apply(this, arguments);
    }
    return L;
}(K);
export var M = function(_superClass) {
    "use strict";
    function M() {
        var _this;
        return swcHelpers.classCallCheck(this, M), _this.prop = 12, swcHelpers.possibleConstructorReturn(_this);
    }
    return swcHelpers.inherits(M, null), swcHelpers.createSuper(M), M;
}(null);
export var N = function(L) {
    "use strict";
    swcHelpers.inherits(N, L);
    var _super = swcHelpers.createSuper(N);
    function N(param) {
        var _this;
        return swcHelpers.classCallCheck(this, N), (_this = _super.call(this)).another = param, _this;
    }
    return N;
}(L);
export var O = function(N) {
    "use strict";
    swcHelpers.inherits(O, N);
    var _super = swcHelpers.createSuper(O);
    function O(param) {
        var _this;
        return swcHelpers.classCallCheck(this, O), (_this = _super.call(this, param)).another2 = param, _this;
    }
    return O;
}(N);
export var VariableBase = function(x) {
    "use strict";
    swcHelpers.inherits(VariableBase, null);
    var _super = swcHelpers.createSuper(VariableBase);
    function VariableBase() {
        return swcHelpers.classCallCheck(this, VariableBase), _super.apply(this, arguments);
    }
    return VariableBase;
}(null);
export var HasStatics = function() {
    "use strict";
    function HasStatics() {
        swcHelpers.classCallCheck(this, HasStatics);
    }
    return HasStatics.staticMethod = function() {}, HasStatics;
}();
export var ExtendsStatics = function(HasStatics) {
    "use strict";
    swcHelpers.inherits(ExtendsStatics, HasStatics);
    var _super = swcHelpers.createSuper(ExtendsStatics);
    function ExtendsStatics() {
        return swcHelpers.classCallCheck(this, ExtendsStatics), _super.apply(this, arguments);
    }
    return ExtendsStatics.also = function() {}, ExtendsStatics;
}(HasStatics);
export { G, HH as H, I as II, J as JJ };
