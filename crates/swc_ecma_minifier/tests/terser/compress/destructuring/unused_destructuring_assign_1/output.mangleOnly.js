function o(a) {
    var b;
    let o;
    ({ a: b, b: o } = a);
    console.log(o);
}
o({
    a: 1,
    b: 2
});
o({
    b: 4
});
