var vs = [];
function f() {
    for (var i = 0; i < 2; i++) {
        (() => {
            try {
                var x = i;
            } catch (e) {}
            vs.push(() => x);
        })();
        (function () {
            do {
                var y = i;
            } while (0);
            vs.push(() => y);
        })();
        (function () {
            for (var z of [i]);
            vs.push(() => z);
        })();
        (function () {
            l: {
                var w = i;
                if (i) break l;
            }
            vs.push(() => w);
        })();
        (function () {
            for (var k in { [i]: 1 });
            vs.push(() => k);
        })();
        (function () {
            for (var m = i; m < i + 1; m++);
            vs.push(() => m);
        })();
        (function () {
            with ({}) var n = i;
            vs.push(() => n);
        })();
    }
}
f();
console.log(vs.map((g) => g()).join());
