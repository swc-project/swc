function a(a) {
    let e, f, g;
    let h = a.a || {
        e: 7,
        n: 8
    };
    ({ t: b , e: c , n: d , s: e = 9 , o: f , r: g  } = h);
    console.log(b, c, d, e, f, g);
}
let b, c, d;
a({
    a: {
        t: 1,
        e: 2,
        n: 3,
        s: 4,
        o: 5,
        r: 6
    }
});
a({});
