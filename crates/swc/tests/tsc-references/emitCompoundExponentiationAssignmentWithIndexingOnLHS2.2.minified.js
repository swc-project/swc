//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS2.ts]
var _$_ref, _$_ref1, _$_ref2, _$_ref3, globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        0: 2
    };
}
(_ref = foo())[0] = Math.pow(_ref[0], foo()[0]), (_ref = foo())[0] = Math.pow(_ref[0], foo()[0]), (_ref = foo())[0] = Math.pow(_ref[0], (_ref = foo())[0] = Math.pow(_ref[0], 2)), (_$_ref = foo())[0] = Math.pow(_$_ref[0], (_$_ref1 = foo())[0] = Math.pow(_$_ref1[0], 2)), (_$_ref2 = foo())[0] = Math.pow(_$_ref2[0], Math.pow(foo()[0], 2)), (_$_ref3 = foo())[0] = Math.pow(_$_ref3[0], Math.pow(foo()[0], 2));
