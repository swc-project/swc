//// [typeSatisfaction_propertyValueConformance1.ts]
var x = {
    m: true
};
// Should be OK
checkTruths(x);
// Should be OK
checkM(x);
// Should fail under --noPropertyAccessFromIndexSignature
console.log(x.z);
var m = x.m;
// Should be able to detect a failure here
var x2 = {
    m: true,
    s: "false"
};
