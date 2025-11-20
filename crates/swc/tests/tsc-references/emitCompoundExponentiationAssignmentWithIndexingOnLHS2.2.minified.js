//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS2.ts]
var globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        0: 2
    };
}
(_ref = foo())[0] = Math.pow(_ref[0], foo()[0]), (_ref = foo())[0] = Math.pow(_ref[0], foo()[0]), (_ref = foo())[0] = Math.pow(_ref[0], (_ref = foo())[0] = Math.pow(_ref[0], 2)), (_ref = foo())[0] = Math.pow(_ref[0], (_ref = foo())[0] = Math.pow(_ref[0], 2)), (_ref = foo())[0] = Math.pow(_ref[0], Math.pow(foo()[0], 2)), (_ref = foo())[0] = Math.pow(_ref[0], Math.pow(foo()[0], 2));
