function g(m, o) {
    (function () {
        for (let [a, b] of m) console.log(a + b);
    })();
    (function () {
        for (var [c, d] of m) console.log(c * d);
    })();
    (function () {
        try {
            var { e, f } = o;
            console.log(e - f);
        } catch (err) {}
    })();
}
g([[1, 2], [3, 4]], { e: 5, f: 3 });
