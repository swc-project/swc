//// [conditionalOperatorConditionIsObjectType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {}
var condObject, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
foo(), new C(), C.doIt(), condObject.valueOf(), foo(), new C(), C.doIt(), condObject.valueOf(), C.doIt();
