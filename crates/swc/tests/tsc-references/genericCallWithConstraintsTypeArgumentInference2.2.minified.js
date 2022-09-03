//// [genericCallWithConstraintsTypeArgumentInference2.ts]
function foo(t) {}
var r = foo(1), r2 = foo(null), r3 = foo({}), r4 = foo(1), r5 = foo(new Date());
