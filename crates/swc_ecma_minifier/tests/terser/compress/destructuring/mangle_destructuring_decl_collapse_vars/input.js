function test(opts) {
    let a = opts.a || { e: 7, n: 8 };
    let { t: t, e: e, n: n, s: s = 5 + 4, o: o, r: r } = a;
    console.log(t, e, n, s, o, r);
}
test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
test({});
