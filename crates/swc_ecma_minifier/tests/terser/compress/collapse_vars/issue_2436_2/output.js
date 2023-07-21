var o = {
    a: 1,
    b: 2
};
console.log((o.a = 3, {
    x: o.a,
    y: o.b
}));
