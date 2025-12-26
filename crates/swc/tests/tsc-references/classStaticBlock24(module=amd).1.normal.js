//// [classStaticBlock24.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_class_call_check"
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
    var __ = new WeakMap();
    var C = function C() {
        "use strict";
        _class_call_check._(this, C);
    };
    __.set(C, {
        writable: true,
        value: C.x = 1
    });
});
