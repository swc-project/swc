//// [exportClassNameWithObjectAMD.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "Object", {
        enumerable: !0,
        get: function() {
            return Object;
        }
    });
    var Object = function Object() {
        "use strict";
        _class_call_check._(this, Object);
    };
});
