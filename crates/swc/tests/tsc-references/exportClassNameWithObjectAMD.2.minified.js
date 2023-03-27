//// [exportClassNameWithObjectAMD.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "Object", {
        enumerable: !0,
        get: function() {
            return Object;
        }
    }), _class_call_check = _class_call_check.default;
    var Object = function Object() {
        "use strict";
        _class_call_check(this, Object);
    };
});
