//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS2.ts]
var globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        0: 2
    };
}
var ref = foo()[0];
foo()[0] = Math.pow(ref, foo()[0]);
var ref1 = foo()[0], result_foo1 = foo()[0] = Math.pow(ref1, foo()[0]), ref2 = foo()[0], ref3 = foo()[0];
foo()[0] = Math.pow(ref3, foo()[0] = Math.pow(ref2, 2));
var ref4 = foo()[0], ref5 = foo()[0], result_foo2 = foo()[0] = Math.pow(ref5, foo()[0] = Math.pow(ref4, 2)), ref6 = foo()[0];
foo()[0] = Math.pow(ref6, Math.pow(foo()[0], 2));
var ref7 = foo()[0], result_foo3 = foo()[0] = Math.pow(ref7, Math.pow(foo()[0], 2));
