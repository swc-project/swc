//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        prop: 2
    };
}
(_ref = foo()).prop = Math.pow(_ref.prop, 2), (_ref1 = foo()).prop = Math.pow(_ref1.prop, 2), (_ref2 = foo()).prop = Math.pow(_ref2.prop, (_ref3 = foo()).prop = Math.pow(_ref3.prop, 2)), (_ref4 = foo()).prop = Math.pow(_ref4.prop, (_ref5 = foo()).prop = Math.pow(_ref5.prop, 2)), (_ref6 = foo()).prop = Math.pow(_ref6.prop, Math.pow(foo().prop, 2)), (_ref7 = foo()).prop = Math.pow(_ref7.prop, Math.pow(foo().prop, 2));
