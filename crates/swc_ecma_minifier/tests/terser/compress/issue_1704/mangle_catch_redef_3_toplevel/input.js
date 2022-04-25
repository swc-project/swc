var o = "PASS";
try {
    throw 0;
} catch (o) {
    (function () {
        function f() {
            o = "FAIL";
        }
        f(), f();
    })();
}
console.log(o);
