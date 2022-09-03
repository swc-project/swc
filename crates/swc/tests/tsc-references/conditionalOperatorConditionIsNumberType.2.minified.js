//// [conditionalOperatorConditionIsNumberType.ts]
function foo() {
    return 1;
}
var condNumber, exprAny1, exprBoolean1, exprNumber1, exprString1, exprIsObject1, exprAny2, exprBoolean2, exprNumber2, exprString2, exprIsObject2, array = [
    1,
    2,
    3
];
foo(), foo(), array[1], foo();
var resultIsAny1 = condNumber ? exprAny1 : exprAny2, resultIsBoolean1 = condNumber ? exprBoolean1 : exprBoolean2, resultIsNumber1 = condNumber ? exprNumber1 : exprNumber2, resultIsString1 = condNumber ? exprString1 : exprString2, resultIsObject1 = condNumber ? exprIsObject1 : exprIsObject2, resultIsStringOrBoolean1 = condNumber ? exprString1 : exprBoolean1, resultIsAny2 = exprAny1, resultIsBoolean2 = exprBoolean2, resultIsNumber2 = exprNumber1, resultIsString2 = exprString1, resultIsObject2 = exprIsObject1, resultIsStringOrBoolean2 = exprString1, resultIsAny3 = exprAny2, resultIsBoolean3 = exprBoolean1, resultIsNumber3 = exprNumber1, resultIsString3 = foo() ? exprString1 : exprString2, resultIsObject3 = foo() / array[1] ? exprIsObject1 : exprIsObject2, resultIsStringOrBoolean3 = foo() / array[1] ? exprString1 : exprBoolean1;
