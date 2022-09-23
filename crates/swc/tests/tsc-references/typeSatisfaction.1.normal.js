//// [typeSatisfaction.ts]
var t1 = {
    a: 1
}; // Ok
var t2 = {
    a: 1,
    b: 1
}; // Error
var t3 = {}; // Error
var t4 = {
    a: "a"
}; // Ok
var t5 = function(m) {
    return m.substring(0);
}; // Ok
var t6 = [
    1,
    2
];
var t7 = {
    a: "test"
};
var t8 = {
    a: "test",
    b: "test"
};
