//// [computedPropertyNames10_ES6.ts]
var s;
var n;
var a;
var v = {
    [s] () {},
    [n] () {},
    [s + s] () {},
    [s + n] () {},
    [+s] () {},
    [""] () {},
    [0] () {},
    [a] () {},
    [true] () {},
    [`hello bye`] () {},
    [`hello ${a} bye`] () {}
};
