class OuterEvalMutableClass {
}
function constructOuterClassAfterEval() {
    return eval("OuterEvalMutableClass = ExternalClass"), new OuterEvalMutableClass(1, 2, 3);
}
function OuterEvalMutableFunction() {}
function constructOuterFunctionAfterEval() {
    return eval("OuterEvalMutableFunction = ExternalFunction"), new OuterEvalMutableFunction(1, 2, 3);
}
out.OuterEvalMutableClass = OuterEvalMutableClass, out.constructOuterClassAfterEval = constructOuterClassAfterEval, out.OuterEvalMutableFunction = OuterEvalMutableFunction, out.constructOuterFunctionAfterEval = constructOuterFunctionAfterEval;
