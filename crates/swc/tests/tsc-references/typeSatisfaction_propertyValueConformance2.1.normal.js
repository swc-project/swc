//// [typeSatisfaction_propertyValueConformance2.ts]
var x = {
    m: true
};
// Should be OK
checkTruths(x);
// Should be OK
checkM(x);
console.log(x.z);
// Should be OK under --noUncheckedIndexedAccess
var m = x.m;
// Should be able to detect a failure here
var x2 = {
    m: true,
    s: "false"
};
