var o;
console.log({
    x: (o = {
        a: 1,
        b: 2
    }).a,
    y: o.b
});
