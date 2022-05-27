function a(a) {
    let b = a.a || {
        e: 7,
        n: 8
    };
    let { t: c , e: d , n: e , s: f = 5 + 4 , o: g , r: h  } = b;
    console.log(c, d, e, f, g, h);
}
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
