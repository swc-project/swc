var vs = [];
function f() {
    (function () {
        try {
            var x = 1;
        } catch (e) {}
        vs.push(() => x);
    })();
    (function () {
        try {
            var x = 2;
        } catch (e) {}
        vs.push(() => x);
    })();
}
f();
console.log(vs.map((g) => g()).join());
