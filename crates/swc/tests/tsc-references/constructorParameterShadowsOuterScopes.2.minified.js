//// [constructorParameterShadowsOuterScopes.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x = 1, C = function C(x1) {
    "use strict";
    _class_call_check(this, C), this.b = x;
}, y = 1, D = function D(x) {
    "use strict";
    _class_call_check(this, D), this.b = y;
};
