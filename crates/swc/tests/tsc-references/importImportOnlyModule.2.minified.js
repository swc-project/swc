//// [foo_0.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "C1", {
        enumerable: !0,
        get: function() {
            return C1;
        }
    }), _class_call_check = _class_call_check.default;
    var C1 = function C1() {
        "use strict";
        _class_call_check(this, C1), this.m1 = 42;
    };
    C1.s1 = !0;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
//// [foo_2.ts]
define([
    "require",
    "exports",
    "./foo_1"
], function(require, exports, _foo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
