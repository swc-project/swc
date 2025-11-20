//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var globalCounter = 0;
function foo() {
    globalCounter += 1;
    return {
        prop: 2
    };
}
foo().prop = Math.pow(foo().prop, 2);
var result0 = foo().prop = Math.pow(foo().prop, 2);
foo().prop = Math.pow(foo().prop, foo().prop = Math.pow(foo().prop, 2));
var result1 = foo().prop = Math.pow(foo().prop, foo().prop = Math.pow(foo().prop, 2));
foo().prop = Math.pow(foo().prop, Math.pow(foo().prop, 2));
var result2 = foo().prop = Math.pow(foo().prop, Math.pow(foo().prop, 2));
