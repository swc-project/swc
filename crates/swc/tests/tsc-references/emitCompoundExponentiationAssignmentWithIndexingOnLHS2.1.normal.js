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
var _$_ref;
var _$_ref1;
var result_foo2 = (_$_ref = foo(), _$_ref[0] = Math.pow(_$_ref[0], (_$_ref1 = foo(), _$_ref1[0] = Math.pow(_$_ref1[0], 2))));
var _$_ref2;
_$_ref2 = foo(), _$_ref2[0] = Math.pow(_$_ref2[0], Math.pow(foo()[0], 2));
var _$_ref3;
var result_foo3 = (_$_ref3 = foo(), _$_ref3[0] = Math.pow(_$_ref3[0], Math.pow(foo()[0], 2)));
