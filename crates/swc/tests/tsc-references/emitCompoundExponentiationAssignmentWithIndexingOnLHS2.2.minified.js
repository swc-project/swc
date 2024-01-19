//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS2.ts]
var globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        0: 2
    };
}
foo()[0] = Math.pow(foo()[0], foo()[0]), foo()[0] = Math.pow(foo()[0], foo()[0]);
var ref2 = foo()[0];
foo()[0] = Math.pow(foo()[0], foo()[0] = Math.pow(ref2, 2));
var ref4 = foo()[0];
foo()[0] = Math.pow(foo()[0], foo()[0] = Math.pow(ref4, 2)), foo()[0] = Math.pow(foo()[0], Math.pow(foo()[0], 2)), foo()[0] = Math.pow(foo()[0], Math.pow(foo()[0], 2));
