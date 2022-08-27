//// [classStaticBlock24.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
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
    _classCallCheck = _classCallCheck.default;
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    var __ = {
        writable: true,
        value: function() {
            C.x = 1;
        }()
    };
});
