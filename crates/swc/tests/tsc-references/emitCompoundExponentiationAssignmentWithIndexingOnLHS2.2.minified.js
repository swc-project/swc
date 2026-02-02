//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS2.ts]
var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        0: 2
    };
}
(_ref = foo())[0] = Math.pow(_ref[0], foo()[0]), (_ref1 = foo())[0] = Math.pow(_ref1[0], foo()[0]), (_ref2 = foo())[0] = Math.pow(_ref2[0], (_ref3 = foo())[0] = Math.pow(_ref3[0], 2)), (_ref4 = foo())[0] = Math.pow(_ref4[0], (_ref5 = foo())[0] = Math.pow(_ref5[0], 2)), (_ref6 = foo())[0] = Math.pow(_ref6[0], Math.pow(foo()[0], 2)), (_ref7 = foo())[0] = Math.pow(_ref7[0], Math.pow(foo()[0], 2));
