function f(o) {
    !(function () {
        try {
            throw 0;
        } catch (c) {
            var o = 1;
            console.log(c, o);
        }
    })();
}
f();
