//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS2.ts]
var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
var globalCounter = 0;
function foo() {
    globalCounter += 1;
    return {
        0: 2
    };
}
_ref = foo(), _ref[0] = Math.pow(_ref[0], foo()[0]);
var result_foo1 = (_ref1 = foo(), _ref1[0] = Math.pow(_ref1[0], foo()[0]));
_ref2 = foo(), _ref2[0] = Math.pow(_ref2[0], (_ref3 = foo(), _ref3[0] = Math.pow(_ref3[0], 2)));
var result_foo2 = (_ref4 = foo(), _ref4[0] = Math.pow(_ref4[0], (_ref5 = foo(), _ref5[0] = Math.pow(_ref5[0], 2))));
_ref6 = foo(), _ref6[0] = Math.pow(_ref6[0], Math.pow(foo()[0], 2));
var result_foo3 = (_ref7 = foo(), _ref7[0] = Math.pow(_ref7[0], Math.pow(foo()[0], 2)));
