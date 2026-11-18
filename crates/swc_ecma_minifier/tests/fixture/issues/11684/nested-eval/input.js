class OuterEvalMutableClass {}

out.OuterEvalMutableClass = OuterEvalMutableClass;

function constructOuterClassAfterEval() {
    eval("OuterEvalMutableClass = ExternalClass");
    return new OuterEvalMutableClass(1, 2, 3);
}

out.constructOuterClassAfterEval = constructOuterClassAfterEval;

function OuterEvalMutableFunction() {}

out.OuterEvalMutableFunction = OuterEvalMutableFunction;

function constructOuterFunctionAfterEval() {
    eval("OuterEvalMutableFunction = ExternalFunction");
    return new OuterEvalMutableFunction(1, 2, 3);
}

out.constructOuterFunctionAfterEval = constructOuterFunctionAfterEval;
