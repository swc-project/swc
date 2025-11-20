//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        prop: 2
    };
}
foo().prop = Math.pow(foo().prop, 2), foo().prop = Math.pow(foo().prop, 2), foo().prop = Math.pow(foo().prop, foo().prop = Math.pow(foo().prop, 2)), foo().prop = Math.pow(foo().prop, foo().prop = Math.pow(foo().prop, 2)), foo().prop = Math.pow(foo().prop, Math.pow(foo().prop, 2)), foo().prop = Math.pow(foo().prop, Math.pow(foo().prop, 2));
