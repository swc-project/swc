function f(a) {
    (function () {
        try {
            var t = a + 1;
        } catch (e) {}
        console.log("try", t);
    })();
    (function () {
        var k = 0;
        while (k++ < 1) {
            var w = a + 2;
        }
        console.log("while", w);
    })();
    (function () {
        do {
            var d = a + 3;
        } while (0);
        console.log("do", d);
    })();
    (function () {
        for (var i = a; i < a + 2; i++);
        console.log("for", i);
    })();
    (function () {
        for (var p in { [a]: 1 });
        console.log("for-in", p);
    })();
    (function () {
        for (var o of [a, a + 4]);
        console.log("for-of", o);
    })();
    (function () {
        l: {
            var b = a + 5;
            if (a) break l;
        }
        console.log("labeled", b);
    })();
}
f(10);
