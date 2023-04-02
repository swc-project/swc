//// [classStaticBlock24.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "C", {
        enumerable: true,
        get: function() {
            return C;
        }
    });
    _class_call_check = _class_call_check.default;
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    (function() {
        C.x = 1;
    })();
});
