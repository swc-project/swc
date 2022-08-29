//// [intersectionWithUnionConstraint.ts]
function f1(x) {
    // Combined constraint of 'T & U' is 'string | number'
    var y = x;
}
function f2(x) {
    var y1 = x; // Error
    var y2 = x; // Error
    var y3 = x;
    var y4 = x; // Error
    var y5 = x; // Error
    var y6 = x; // Error
}
function f3(x) {
    var y = x;
}
function f4(x) {
    var y = x;
}
function f5(x) {
    var y = x;
}
