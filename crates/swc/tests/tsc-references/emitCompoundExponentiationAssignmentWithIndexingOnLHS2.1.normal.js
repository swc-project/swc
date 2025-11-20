//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS2.ts]
var globalCounter = 0;
function foo() {
    globalCounter += 1;
    return {
        0: 2
    };
}
_ref = foo(), _ref[0] = Math.pow(_ref[0], foo()[0]);
var result_foo1 = (_ref = foo(), _ref[0] = Math.pow(_ref[0], foo()[0]));
_ref = foo(), _ref[0] = Math.pow(_ref[0], (_ref = foo(), _ref[0] = Math.pow(_ref[0], 2)));
var result_foo2 = (_ref = foo(), _ref[0] = Math.pow(_ref[0], (_ref = foo(), _ref[0] = Math.pow(_ref[0], 2))));
_ref = foo(), _ref[0] = Math.pow(_ref[0], Math.pow(foo()[0], 2));
var result_foo3 = (_ref = foo(), _ref[0] = Math.pow(_ref[0], Math.pow(foo()[0], 2)));
