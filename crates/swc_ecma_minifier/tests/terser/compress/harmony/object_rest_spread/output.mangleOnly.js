var { w: d , ...b } = {
    w: 7,
    x: 1,
    y: 2
};
console.log(d, b);
let { w: e , ...a } = {
    w: 8,
    x: 3,
    y: 4
};
console.log(e, a);
const { w: f , ...g } = {
    w: 9,
    x: 5,
    y: 6
};
console.log(f, g);
let c;
({ b: c , ...b } = {
    a: 1,
    b: 2,
    c: 3
});
console.log(b);
({ b: c , ...a } = {
    a: 4,
    b: 5,
    c: 6
});
console.log(a);
(function({ y: b , ...a }) {
    console.log(a);
})({
    x: 1,
    y: 2,
    z: 3
});
(({ y: b , ...a })=>{
    console.log(a);
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
    ...a,
    ...{
        K: 9
    }
});
