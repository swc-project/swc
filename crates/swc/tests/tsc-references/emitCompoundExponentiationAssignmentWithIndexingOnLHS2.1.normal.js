//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS2.ts]
var globalCounter = 0;
function foo() {
    globalCounter += 1;
    return {
        0: 2
    };
}
foo()[0] = Math.pow(foo()[0], foo()[0]);
var result_foo1 = foo()[0] = Math.pow(foo()[0], foo()[0]);
foo()[0] = Math.pow(foo()[0], foo()[0] = Math.pow(foo()[0], 2));
var result_foo2 = foo()[0] = Math.pow(foo()[0], foo()[0] = Math.pow(foo()[0], 2));
foo()[0] = Math.pow(foo()[0], Math.pow(foo()[0], 2));
var result_foo3 = foo()[0] = Math.pow(foo()[0], Math.pow(foo()[0], 2));
