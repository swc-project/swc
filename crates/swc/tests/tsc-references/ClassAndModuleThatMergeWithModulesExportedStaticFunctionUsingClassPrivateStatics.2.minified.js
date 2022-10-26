//// [ClassAndModuleThatMergeWithModulesExportedStaticFunctionUsingClassPrivateStatics.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var clodule = function() {
    "use strict";
    function clodule() {
        _class_call_check(this, clodule);
    }
    return clodule.sfn = function(id) {
        return 42;
    }, clodule;
}();
(clodule || (clodule = {})).fn = function(x, y) {
    return clodule.sfn("a");
};
