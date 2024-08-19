//// [ClassAndModuleThatMergeWithModulesExportedGenericFunctionAndGenericClassStaticFunctionOfTheSameName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var clodule = /*#__PURE__*/ function() {
    function clodule() {
        _class_call_check(this, clodule);
    }
    return clodule.fn = function(id) {}, clodule;
}();
(clodule || (clodule = {})).fn = function(x, y) {
    return x;
};
