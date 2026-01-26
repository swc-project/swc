// Issue #11255: compress.comparisons should not optimize comparisons with side effects
let o = 0;
const c = [
    0,
    ''
];
const l = [
    0,
    0,
    1
];
console.log(c[l[++o]] === c[l[++o]]);
