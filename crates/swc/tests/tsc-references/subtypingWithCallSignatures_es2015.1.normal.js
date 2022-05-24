var CallSignature;
(function(CallSignature) {
    var r = foo1((x)=>1); // ok because base returns void
    var r2 = foo1((x)=>''); // ok because base returns void
    var r3 = foo2((x, y)=>1); // ok because base returns void
    var r4 = foo2((x)=>''); // ok because base returns void
})(CallSignature || (CallSignature = {}));
