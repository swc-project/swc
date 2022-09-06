function e(e) {
    let n = e.a || { e: 7, n: 8 };
    let { t: o, e: t, n: l, s: s = 5 + 4, o: a, r: c } = n;
    console.log(o, t, l, s, a, c);
}
e({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
e({});
