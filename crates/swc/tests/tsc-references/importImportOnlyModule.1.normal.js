//// [foo_0.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "C1", {
        enumerable: true,
        get: function() {
            return C1;
        }
    });
    _class_call_check = _class_call_check.default;
    var C1 = function C1() {
        "use strict";
        _class_call_check(this, C1);
        this.m1 = 42;
    };
    (function() {
        C1.s1 = true;
    })();
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var answer = 42; // No exports
});
//// [foo_2.ts]
define([
    "require",
    "exports",
    "./foo_1"
], function(require, exports, _foo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var x = _foo_1; // Cause a runtime dependency
});
