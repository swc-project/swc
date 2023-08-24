//// [typeSatisfaction_propertyValueConformance2.ts]
var x = {
    m: !0
};
// Should be OK
checkTruths(x), // Should be OK
checkM(x), console.log(x.z), x.m;
