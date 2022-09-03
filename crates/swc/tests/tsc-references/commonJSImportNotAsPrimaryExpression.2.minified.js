//// [foo_0.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    E1: function() {
        return E1;
    },
    C1: function() {
        return C1;
    }
});
var E1, _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1), this.m1 = 42;
};
C1.s1 = !0, function(E1) {
    E1[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C";
}(E1 || (E1 = {}));
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var i, z, foo = require("./foo_0"), x = {}, y = !1, e = 0;
