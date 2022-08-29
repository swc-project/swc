//// [exportClassNameWithObjectAMD.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Object", {
        enumerable: true,
        get: function() {
            return Object;
        }
    });
    _classCallCheck = _classCallCheck.default;
    var Object = function Object() {
        "use strict";
        _classCallCheck(this, Object);
    };
});
