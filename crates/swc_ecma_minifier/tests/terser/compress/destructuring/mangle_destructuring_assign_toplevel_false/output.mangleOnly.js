function e(e) {
    let o, a, c;
    let f = e.a || {
        e: 7,
        n: 8
    };
    ({ t , e: l , n , s: o = 9 , o: a , r: c  } = f);
    console.log(t, l, n, o, a, c);
}
let t, l, n;
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
