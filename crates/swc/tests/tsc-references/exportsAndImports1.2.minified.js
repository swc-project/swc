//// [exportsAndImports1.ts]
"use strict";
//// [t1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    v: function() {
        return v;
    },
    f: function() {
        return f;
    },
    C: function() {
        return C;
    },
    E: function() {
        return E;
    },
    D: function() {
        return D;
    },
    M: function() {
        return M;
    },
    a: function() {
        return a;
    }
});
var E, D, M, _class_call_check = require("@swc/helpers/_/_class_call_check"), v = 1;
function f() {}
var C = function C() {
    "use strict";
    _class_call_check._(this, C);
};
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {})), function(D) {
    D[D.A = 0] = "A", D[D.B = 1] = "B", D[D.C = 2] = "C";
}(D || (D = {})), function(M) {
    var x;
    M.x = x;
}(M || (M = {}));
var a = M.x;
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    v: function() {
        return _t1.v;
    },
    f: function() {
        return _t1.f;
    },
    C: function() {
        return _t1.C;
    },
    I: function() {
        return _t1.I;
    },
    E: function() {
        return _t1.E;
    },
    D: function() {
        return _t1.D;
    },
    M: function() {
        return _t1.M;
    },
    N: function() {
        return _t1.N;
    },
    T: function() {
        return _t1.T;
    },
    a: function() {
        return _t1.a;
    }
});
var _t1 = require("./t1");
//// [t3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    v: function() {
        return _t1.v;
    },
    f: function() {
        return _t1.f;
    },
    C: function() {
        return _t1.C;
    },
    I: function() {
        return _t1.I;
    },
    E: function() {
        return _t1.E;
    },
    D: function() {
        return _t1.D;
    },
    M: function() {
        return _t1.M;
    },
    N: function() {
        return _t1.N;
    },
    T: function() {
        return _t1.T;
    },
    a: function() {
        return _t1.a;
    }
});
var _t1 = require("./t1");
