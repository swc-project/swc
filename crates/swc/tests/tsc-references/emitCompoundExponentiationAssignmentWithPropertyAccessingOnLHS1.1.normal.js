//// [emitCompoundExponentiationAssignmentWithPropertyAccessingOnLHS1.ts]
var globalCounter = 0;
function foo() {
    globalCounter += 1;
    return {
        prop: 2
    };
}
var ref = foo().prop;
foo().prop = Math.pow(ref, 2);
var ref1 = foo().prop;
var result0 = foo().prop = Math.pow(ref1, 2);
var ref2 = foo().prop, ref3 = foo().prop;
foo().prop = Math.pow(ref3, foo().prop = Math.pow(ref2, 2));
var ref4 = foo().prop, ref5 = foo().prop;
var result1 = foo().prop = Math.pow(ref5, foo().prop = Math.pow(ref4, 2));
var ref6 = foo().prop;
foo().prop = Math.pow(ref6, Math.pow(foo().prop, 2));
var ref7 = foo().prop;
var result2 = foo().prop = Math.pow(ref7, Math.pow(foo().prop, 2));
