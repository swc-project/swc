var a;
console.log((((a = {
    a: 1,
    b: 2
}).a = 3), {
    x: a.a,
    y: a.b
}));
