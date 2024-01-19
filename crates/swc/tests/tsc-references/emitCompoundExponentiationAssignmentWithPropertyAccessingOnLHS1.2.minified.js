//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var globalCounter = 0;
function foo() {
    return globalCounter += 1, {
        prop: 2
    };
}
foo().prop = Math.pow(foo().prop, 2), foo().prop = Math.pow(foo().prop, 2);
var ref2 = foo().prop;
foo().prop = Math.pow(foo().prop, foo().prop = Math.pow(ref2, 2));
var ref4 = foo().prop;
foo().prop = Math.pow(foo().prop, foo().prop = Math.pow(ref4, 2)), foo().prop = Math.pow(foo().prop, Math.pow(foo().prop, 2)), foo().prop = Math.pow(foo().prop, Math.pow(foo().prop, 2));
