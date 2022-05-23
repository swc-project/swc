function test(opts) {
    let s, o, r;
    let a = opts.a || { e: 7, n: 8 };
    ({ t, e, n, s = 5 + 4, o, r } = a);
    console.log(t, e, n, s, o, r);
}
let t, e, n;
test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
test({});
