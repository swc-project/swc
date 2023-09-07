//// [ExportVariableOfGenericTypeWithInaccessibleTypeAsTypeArgument.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    var B = function B() {
        "use strict";
        _class_call_check(this, B);
    };
    var beez;
    Object.defineProperty(A, "beez", {
        enumerable: true,
        get: function get() {
            return beez;
        },
        set: function set(v) {
            beez = v;
        }
    });
    var beez2 = new Array();
    Object.defineProperty(A, "beez2", {
        enumerable: true,
        get: function get() {
            return beez2;
        },
        set: function set(v) {
            beez2 = v;
        }
    });
})(A || (A = {}));
