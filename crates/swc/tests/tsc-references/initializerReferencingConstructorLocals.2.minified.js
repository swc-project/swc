//// [initializerReferencingConstructorLocals.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C(x) {
    "use strict";
    _class_call_check(this, C), this.a = z, this.c = this.z, z = 1;
}, D = function D(x) {
    "use strict";
    _class_call_check(this, D), this.a = z, this.c = this.z, z = 1;
};
