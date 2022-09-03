//// [computedPropertyNames10_ES6.ts]
var s, n, a, v = {
    [s] () {},
    [n] () {},
    [s + s] () {},
    [s + n] () {},
    [+s] () {},
    "" () {},
    0 () {},
    [a] () {},
    [!0] () {},
    "hello bye" () {},
    [`hello ${a} bye`] () {}
};
