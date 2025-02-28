var { w: n, ...l } = {
    w: 7,
    x: 1,
    y: 2
};
console.log(n, l);
let { w: e, ...o } = {
    w: 8,
    x: 3,
    y: 4
};
console.log(e, o);
const { w: s, ...g } = {
    w: 9,
    x: 5,
    y: 6
};
console.log(s, g);
let c;
({ b: c, ...l } = {
    a: 1,
    b: 2,
    c: 3
});
console.log(l);
({ b: c, ...o } = {
    a: 4,
    b: 5,
    c: 6
});
console.log(o);
(function({ y: l, ...o }) {
    console.log(o);
})({
    x: 1,
    y: 2,
    z: 3
});
(({ y: l, ...o })=>{
    console.log(o);
})({
    x: 4,
    y: 5,
    z: 6
});
const w = {
    a: 1,
    b: 2
};
console.log({
    ...w,
    w: 0,
    ...o,
    K: 9
});
