const a = ()=>null;
const b = ()=>a;
const c = [
    b(),
    b()
];
console.log(c[0] === c[1]);
const d = {
    a: b(),
    b: b()
};
console.log(d.a === d.b);
