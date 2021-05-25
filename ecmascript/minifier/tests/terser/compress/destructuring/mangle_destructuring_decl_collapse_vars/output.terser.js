function test(t) {
    let e = t.a || { e: 7, n: 8 };
    let { t: n, e: o, n: s, s: l = 9, o: a, r: c } = e;
    console.log(n, o, s, l, a, c);
}
test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
test({});
