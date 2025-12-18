//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
var globalCounter = 0;
function foo() {
    globalCounter += 1;
    return {
        prop: 2
    };
}
_ref = foo(), _ref.prop = Math.pow(_ref.prop, 2);
var result0 = (_ref1 = foo(), _ref1.prop = Math.pow(_ref1.prop, 2));
_ref2 = foo(), _ref2.prop = Math.pow(_ref2.prop, (_ref3 = foo(), _ref3.prop = Math.pow(_ref3.prop, 2)));
var result1 = (_ref4 = foo(), _ref4.prop = Math.pow(_ref4.prop, (_ref5 = foo(), _ref5.prop = Math.pow(_ref5.prop, 2))));
_ref6 = foo(), _ref6.prop = Math.pow(_ref6.prop, Math.pow(foo().prop, 2));
var result2 = (_ref7 = foo(), _ref7.prop = Math.pow(_ref7.prop, Math.pow(foo().prop, 2)));
