//// [conditionalOperatorConditionIsObjectType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var condObject, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
new C(), C.doIt(), condObject.valueOf(), new C(), C.doIt(), condObject.valueOf(), C.doIt();
