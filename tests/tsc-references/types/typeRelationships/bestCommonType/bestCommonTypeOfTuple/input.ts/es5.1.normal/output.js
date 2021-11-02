function f1(x) {
    return "foo";
}
function f2(x) {
    return 10;
}
function f3(x) {
    return true;
}
var E11;
(function(E1) {
    E1[E1["one"] = 0] = "one";
})(E11 || (E11 = {
}));
var E21;
(function(E2) {
    E2[E2["two"] = 0] = "two";
})(E21 || (E21 = {
}));
var t1;
var t2;
var t3;
var t4;
// no error
t1 = [
    f1,
    f2
];
t2 = [
    E11.one,
    E21.two
];
t3 = [
    5,
    undefined
];
t4 = [
    E11.one,
    E21.two,
    20
];
var e1 = t1[2]; // {}
var e2 = t2[2]; // {}
var e3 = t3[2]; // any
var e4 = t4[3]; // number
