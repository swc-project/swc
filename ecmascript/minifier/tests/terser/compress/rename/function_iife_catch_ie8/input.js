function f(n) {
    !(function () {
        try {
            throw 0;
        } catch (n) {
            var a = 1;
            console.log(n, a);
        }
    })();
}
f();
