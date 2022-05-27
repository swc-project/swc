function a(g) {
    let a, e, f;
    let h = g.a || {
        e: 7,
        n: 8
    };
    ({ t: b , e: c , n: d , s: a = 9 , o: e , r: f  } = h);
    console.log(b, c, d, a, e, f);
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
