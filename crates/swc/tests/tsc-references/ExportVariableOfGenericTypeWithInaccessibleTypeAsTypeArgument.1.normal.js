//// [ExportVariableOfGenericTypeWithInaccessibleTypeAsTypeArgument.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    var B = function B() {
        "use strict";
        _class_call_check(this, B);
    };
    var beez = A.beez = void 0;
    var beez2 = A.beez2 = new Array();
})(A || (A = {}));
