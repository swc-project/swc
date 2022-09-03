//// [conditionalOperatorConditoinIsStringType.ts]
import _type_of from "@swc/helpers/src/_type_of.mjs";
function foo() {
    return "string";
}
var condString, exprAny1, exprBoolean1, exprNumber1, exprString1, exprIsObject1, exprAny2, exprBoolean2, exprNumber2, exprString2, exprIsObject2, array = [
    "1",
    "2",
    "3"
];
void 0 === condString || _type_of(condString), condString.toUpperCase, foo(), array[1], foo();
var resultIsAny1 = condString ? exprAny1 : exprAny2, resultIsBoolean1 = condString ? exprBoolean1 : exprBoolean2, resultIsNumber1 = condString ? exprNumber1 : exprNumber2, resultIsString1 = condString ? exprString1 : exprString2, resultIsObject1 = condString ? exprIsObject1 : exprIsObject2, resultIsStringOrBoolean1 = condString ? exprString1 : exprBoolean1, resultIsAny2 = exprAny2, resultIsBoolean2 = exprBoolean1, resultIsNumber2 = exprNumber1, resultIsString2 = exprString1, resultIsObject2 = exprIsObject1, resultIsStringOrBoolean2 = exprString1, resultIsAny3 = (void 0 === condString ? "undefined" : _type_of(condString)) ? exprAny1 : exprAny2, resultIsBoolean3 = condString.toUpperCase ? exprBoolean1 : exprBoolean2, resultIsNumber3 = exprNumber1, resultIsString3 = foo() ? exprString1 : exprString2, resultIsObject3 = array[1] ? exprIsObject1 : exprIsObject2, resultIsStringOrBoolean3 = (void 0 === condString ? "undefined" : _type_of(condString)) ? exprString1 : exprBoolean1, resultIsStringOrBoolean4 = condString.toUpperCase ? exprString1 : exprBoolean1;
