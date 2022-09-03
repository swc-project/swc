//// [conditionalOperatorConditionIsObjectType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {}
var condObject, exprAny1, exprBoolean1, exprNumber1, exprString1, exprIsObject1, exprAny2, exprBoolean2, exprNumber2, exprString2, exprIsObject2, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
foo(), new C(), C.doIt(), condObject.valueOf();
var resultIsAny1 = condObject ? exprAny1 : exprAny2, resultIsBoolean1 = condObject ? exprBoolean1 : exprBoolean2, resultIsNumber1 = condObject ? exprNumber1 : exprNumber2, resultIsString1 = condObject ? exprString1 : exprString2, resultIsObject1 = condObject ? exprIsObject1 : exprIsObject2, resultIsStringOrBoolean1 = condObject ? exprString1 : exprBoolean1, resultIsAny2 = exprAny1, resultIsBoolean2 = exprBoolean1, resultIsNumber2 = exprNumber1, resultIsString2 = exprString1, resultIsObject2 = exprIsObject1, resultIsStringOrBoolean2 = exprString1, resultIsAny3 = foo() ? exprAny1 : exprAny2, resultIsBoolean3 = exprBoolean1, resultIsNumber3 = (new C(), exprNumber1), resultIsString3 = C.doIt() ? exprString1 : exprString2, resultIsObject3 = condObject.valueOf() ? exprIsObject1 : exprIsObject2, resultIsStringOrBoolean3 = C.doIt() ? exprString1 : exprBoolean1;
