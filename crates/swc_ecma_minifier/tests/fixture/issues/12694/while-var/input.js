var vs = [];
function f() {
    for (var i = 0; i < 2; i++) {
        (function () {
            var k = 0;
            while (k++ < 1) {
                var x = i;
            }
            vs.push(() => x);
        })();
    }
}
f();
console.log(vs.map((g) => g()).join());
