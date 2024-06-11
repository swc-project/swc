//// [subtypingWithCallSignatures.ts]
var CallSignature;
CallSignature || (CallSignature = {}), foo1(function(x) {
    return 1;
}), foo1(function(x) {
    return '';
}), foo2(function(x, y) {
    return 1;
}), foo2(function(x) {
    return '';
});
