//// [typeSatisfaction_propertyValueConformance1.ts]
var x = {
    m: !0
};
// Should be OK
checkTruths(x), // Should be OK
checkM(x), // Should fail under --noPropertyAccessFromIndexSignature
console.log(x.z), x.m;
