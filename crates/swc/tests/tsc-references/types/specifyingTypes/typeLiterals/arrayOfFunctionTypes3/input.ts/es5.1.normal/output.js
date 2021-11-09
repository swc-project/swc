function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// valid uses of arrays of function types
var x = [
    function() {
        return 1;
    },
    function() {
    }
];
var r2 = x[0]();
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var y = [
    C,
    C
];
var r3 = new y[0]();
var a;
var b;
var c;
var z = [
    a,
    b,
    c
];
var r4 = z[0];
var r5 = r4(''); // any not string
var r5b = r4(1);
var a2;
var b2;
var c2;
var z2 = [
    a2,
    b2,
    c2
];
var r6 = z2[0];
var r7 = r6(''); // any not string
