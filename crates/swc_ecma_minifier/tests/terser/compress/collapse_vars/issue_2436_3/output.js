var c, o = {
    a: 1,
    b: 2
};
console.log((c = o, o = {
    a: 3,
    b: 4
}, {
    x: c.a,
    y: c.b
}));
