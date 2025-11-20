//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var globalCounter = 0;
function foo() {
    globalCounter += 1;
    return {
        prop: 2
    };
}
_ref = foo(), _ref.prop = Math.pow(_ref.prop, 2);
var result0 = (_ref = foo(), _ref.prop = Math.pow(_ref.prop, 2));
_ref = foo(), _ref.prop = Math.pow(_ref.prop, (_ref = foo(), _ref.prop = Math.pow(_ref.prop, 2)));
var result1 = (_ref = foo(), _ref.prop = Math.pow(_ref.prop, (_ref = foo(), _ref.prop = Math.pow(_ref.prop, 2))));
_ref = foo(), _ref.prop = Math.pow(_ref.prop, Math.pow(foo().prop, 2));
var result2 = (_ref = foo(), _ref.prop = Math.pow(_ref.prop, Math.pow(foo().prop, 2)));
