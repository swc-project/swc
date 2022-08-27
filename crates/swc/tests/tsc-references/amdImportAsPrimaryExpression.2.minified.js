//// [foo_0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    var E1, E11;
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "E1", {
        enumerable: !0,
        get: function() {
            return E1;
        }
    }), (E11 = E1 || (E1 = {}))[E11.A = 0] = "A", E11[E11.B = 1] = "B", E11[E11.C = 2] = "C";
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
    }), _foo0.E1.A;
});
