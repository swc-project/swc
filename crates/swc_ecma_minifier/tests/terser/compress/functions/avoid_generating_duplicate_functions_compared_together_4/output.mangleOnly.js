const d = ()=>null;
const a = ()=>d;
const b = [
    a(),
    a()
];
console.log(b[0] === b[1]);
const c = {
    a: a(),
    b: a()
};
console.log(c.a === c.b);
