//// [contextualTypeWithTuple.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
new C(), new C(), new C(), new function D() {
    "use strict";
    _class_call_check(this, D);
}();
