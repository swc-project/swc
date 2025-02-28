const l = ()=>null;
const o = ()=>l;
const n = [
    o(),
    o()
];
console.log(n[0] === n[1]);
const c = {
    a: o(),
    b: o()
};
console.log(c.a === c.b);
