//// [foo_0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "E1", {
        enumerable: true,
        get: function() {
            return E1;
        }
    });
    var E1;
    (function(E1) {
        E1[E1["A"] = 0] = "A";
        E1[E1["B"] = 1] = "B";
        E1[E1["C"] = 2] = "C";
    })(E1 || (E1 = {}));
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    if (_foo0.E1.A === 0) {
    // Should cause runtime import - interesting optimization possibility, as gets inlined to 0.
    }
});
