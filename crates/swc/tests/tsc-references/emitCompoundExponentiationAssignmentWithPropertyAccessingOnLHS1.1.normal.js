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
var _$_ref;
var _$_ref1;
var result1 = (_$_ref = foo(), _$_ref.prop = Math.pow(_$_ref.prop, (_$_ref1 = foo(), _$_ref1.prop = Math.pow(_$_ref1.prop, 2))));
var _$_ref2;
_$_ref2 = foo(), _$_ref2.prop = Math.pow(_$_ref2.prop, Math.pow(foo().prop, 2));
var _$_ref3;
var result2 = (_$_ref3 = foo(), _$_ref3.prop = Math.pow(_$_ref3.prop, Math.pow(foo().prop, 2)));
