const o = ()=>null;
const n = ()=>o;
const c = [
    n(),
    n()
];
console.log(c[0] === c[1]);
const l = {
    a: n(),
    b: n()
};
console.log(l.a === l.b);
