function test(o) {
    let s, l, a;
    let c = o.a || { e: 7, n: 8 };
    ({ t, e, n, s = 9, o: l, r: a } = c);
    console.log(t, e, n, s, l, a);
}
let t, e, n;
test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
test({});
