function e(c) {
    let e, t, a;
    let s = c.a || {
        e: 7,
        n: 8
    };
    ({ t: l, e: n, n: o, s: e = 5 + 4, o: t, r: a } = s);
    console.log(l, n, o, e, t, a);
}
let l, n, o;
e({
    a: {
        t: 1,
        e: 2,
        n: 3,
        s: 4,
        o: 5,
        r: 6
    }
});
e({});
