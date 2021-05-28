function extract(obj) {
    var a;
    let b;
    ({ a: a, b: b } = obj);
    console.log(b);
}
extract({ a: 1, b: 2 });
extract({ b: 4 });
