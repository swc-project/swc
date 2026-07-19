class EvalMutableClass {}

function EvalMutableFunction() {}

out.EvalMutableClass = EvalMutableClass;
out.EvalMutableFunction = EvalMutableFunction;

eval("EvalMutableClass = ExternalClass; EvalMutableFunction = ExternalFunction");

out.classValue = new EvalMutableClass(1, 2, 3);
out.functionValue = new EvalMutableFunction(1, 2, 3);
