function e(e) {
    let t, a, c;
    let s = e.a || {
        e: 7,
        n: 8
    };
    ({ t: l , e: n , n: o , s: t = 5 + 4 , o: a , r: c  } = s);
    console.log(l, n, o, t, a, c);
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
