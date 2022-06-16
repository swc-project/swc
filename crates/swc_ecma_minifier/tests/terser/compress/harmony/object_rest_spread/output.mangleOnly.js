var { w: a , ...b } = {
    w: 7,
    x: 1,
    y: 2
};
console.log(a, b);
let { w: c , ...d } = {
    w: 8,
    x: 3,
    y: 4
};
console.log(c, d);
const { w: e , ...f } = {
    w: 9,
    x: 5,
    y: 6
};
console.log(e, f);
let g;
({ b: g , ...b } = {
    a: 1,
    b: 2,
    c: 3
});
console.log(b);
({ b: g , ...d } = {
    a: 4,
    b: 5,
    c: 6
});
console.log(d);
(function({ y: a , ...b }) {
    console.log(b);
})({
    x: 1,
    y: 2,
    z: 3
});
(({ y: a , ...b })=>{
    console.log(b);
})({
    x: 4,
    y: 5,
    z: 6
});
const h = {
    a: 1,
    b: 2
};
console.log({
    ...h,
    w: 0,
    ...{},
    ...d,
    ...{
        K: 9
    }
});
