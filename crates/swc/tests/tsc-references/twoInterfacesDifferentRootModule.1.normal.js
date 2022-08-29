//// [twoInterfacesDifferentRootModule.ts]
// two interfaces with different root modules should not merge
var M2;
(function(M2) {
    var a;
    var r1 = a.foo; // error
    var r2 = a.bar;
    var b;
    var r3 = b.foo; // error
    var r4 = b.bar;
})(M2 || (M2 = {}));
