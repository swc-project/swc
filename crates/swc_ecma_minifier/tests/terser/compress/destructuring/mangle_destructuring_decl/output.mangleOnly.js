function e(e) {
    let n = e.a || {
        e: 7,
        n: 8
    };
    let { t: t , e: o , n: l , s: a = 5 + 4 , o: r , r: s  } = n;
    console.log(t, o, l, a, r, s);
}
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
