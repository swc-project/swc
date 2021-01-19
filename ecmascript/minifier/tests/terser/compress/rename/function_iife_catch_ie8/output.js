function f(o) {
    !(function () {
        try {
            throw 0;
        } catch (o) {
            var c = 1;
            console.log(o, c);
        }
    })();
}
f();
