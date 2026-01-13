//// [ClassAndModuleThatMergeWithModulesExportedGenericFunctionAndNonGenericClassStaticFunctionOfTheSameName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var clodule = /*#__PURE__*/ function() {
    "use strict";
    function clodule() {
        _class_call_check(this, clodule);
    }
    clodule.fn = function fn(id) {};
    return clodule;
}();
(function(clodule) {
    function fn(x, y) {
        return x;
    }
    clodule.fn = fn;
})(clodule || (clodule = {}));
