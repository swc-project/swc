// @strict: true
function f1(x) {
    // Combined constraint of 'T & U' is 'string | number'
    let y = x;
}
function f2(x) {
    let y1 = x; // Error
    let y2 = x; // Error
    let y3 = x;
    let y4 = x; // Error
    let y5 = x; // Error
    let y6 = x; // Error
}
function f3(x) {
    const y = x;
}
function f4(x) {
    const y = x;
}
function f5(x) {
    let y = x;
}
