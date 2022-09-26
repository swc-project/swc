//// [newOperatorConformance.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var anyCtor, anyCtor1, nestedCtor, T = function T(n) {
    "use strict";
    _class_call_check(this, T);
};
new function C0() {
    "use strict";
    _class_call_check(this, C0);
}, new T, new anyCtor, new anyCtor1(void 0);
var nested = new new new nestedCtor()()();
new nested(), new nested();
