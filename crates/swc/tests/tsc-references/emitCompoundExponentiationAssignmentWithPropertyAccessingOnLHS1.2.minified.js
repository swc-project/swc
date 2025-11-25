//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var _$_ref, _$_ref1, _$_ref2, _$_ref3, globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        prop: 2
    };
}
(_ref = foo()).prop = Math.pow(_ref.prop, 2), (_ref = foo()).prop = Math.pow(_ref.prop, 2), (_ref = foo()).prop = Math.pow(_ref.prop, (_ref = foo()).prop = Math.pow(_ref.prop, 2)), (_$_ref = foo()).prop = Math.pow(_$_ref.prop, (_$_ref1 = foo()).prop = Math.pow(_$_ref1.prop, 2)), (_$_ref2 = foo()).prop = Math.pow(_$_ref2.prop, Math.pow(foo().prop, 2)), (_$_ref3 = foo()).prop = Math.pow(_$_ref3.prop, Math.pow(foo().prop, 2));
