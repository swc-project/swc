// Correct
var _ref = [
    1,
    2,
    3
], A = _ref[0], B = _ref[1];
export function foo() {
    return A;
}
// Incorrect
var _ref1 = {
    c: 1,
    d: 2
}, c = _ref1.c, d = _ref1.d;
var e = 4;
export { c, d, e };
