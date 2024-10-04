//// [subtypingWithCallSignatures.ts]
(function(CallSignature) {
    var r = foo1(function(x) {
        return 1;
    }); // ok because base returns void
    var r2 = foo1(function(x) {
        return '';
    }); // ok because base returns void
    var r3 = foo2(function(x, y) {
        return 1;
    }); // ok because base returns void
    var r4 = foo2(function(x) {
        return '';
    }); // ok because base returns void
})(CallSignature || (CallSignature = {}));
var CallSignature;
