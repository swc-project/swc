//// [foo_0.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        E1: function() {
            return E1;
        },
        C1: function() {
            return C1;
        }
    }), _classCallCheck = _classCallCheck.default;
    var E1, E11, C1 = function C1() {
        "use strict";
        _classCallCheck(this, C1), this.m1 = 42;
    };
    C1.s1 = !0, (E11 = E1 || (E1 = {}))[E11.A = 0] = "A", E11[E11.B = 1] = "B", E11[E11.C = 2] = "C";
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
