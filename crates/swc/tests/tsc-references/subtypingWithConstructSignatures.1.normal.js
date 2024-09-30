//// [subtypingWithConstructSignatures.ts]
(function(ConstructSignature) {
    var rarg1;
    var r = foo1(rarg1); // ok because base returns void
    var rarg2;
    var r2 = foo1(rarg2); // ok because base returns void
    var r3arg1;
    var r3 = foo2(r3arg1); // ok because base returns void
    var r4arg1;
    var r4 = foo2(r4arg1); // ok because base returns void
})(ConstructSignature || (ConstructSignature = {}));
var ConstructSignature;
