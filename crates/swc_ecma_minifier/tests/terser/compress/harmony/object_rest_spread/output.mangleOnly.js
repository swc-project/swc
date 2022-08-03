var { w: o , ...l } = {
    w: 7,
    x: 1,
    y: 2
};
console.log(o, l);
let { w: g , ...w } = {
    w: 8,
    x: 3,
    y: 4
};
console.log(g, w);
const { w: y , ...b } = {
    w: 9,
    x: 5,
    y: 6
};
console.log(y, b);
let c;
({ b: c , ...l } = {
    a: 1,
    b: 2,
    c: 3
});
console.log(l);
({ b: c , ...w } = {
    a: 4,
    b: 5,
    c: 6
});
console.log(w);
(function({ y: o , ...l }) {
    console.log(l);
})({
    x: 1,
    y: 2,
    z: 3
});
(({ y: o , ...l })=>{
    console.log(l);
})({
    x: 4,
    y: 5,
    z: 6
});
const t = {
    a: 1,
    b: 2
};
console.log({
    ...t,
    w: 0,
    ...{},
    ...w,
    ...{
        K: 9
    }
});
