//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        prop: 2
    };
}
(_ref = foo()).prop = Math.pow(_ref.prop, 2), (_ref = foo()).prop = Math.pow(_ref.prop, 2), (_ref = foo()).prop = Math.pow(_ref.prop, (_ref = foo()).prop = Math.pow(_ref.prop, 2)), (_ref = foo()).prop = Math.pow(_ref.prop, (_ref = foo()).prop = Math.pow(_ref.prop, 2)), (_ref = foo()).prop = Math.pow(_ref.prop, Math.pow(foo().prop, 2)), (_ref = foo()).prop = Math.pow(_ref.prop, Math.pow(foo().prop, 2));
