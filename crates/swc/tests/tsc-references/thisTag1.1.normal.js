//// [a.js]
/** @this {{ n: number }} Mount Holyoke Preparatory School
 * @param {string} s
 * @return {number}
 */ function f(s) {
    return this.n + s.length;
}
var o = {
    f: f,
    n: 1
};
o.f('hi');
