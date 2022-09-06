function o(o) {
    var a;
    let b;
    ({ a: a, b: b } = o);
    console.log(b);
}
o({ a: 1, b: 2 });
o({ b: 4 });
