function f(n) {
    !function() {
        try {
            throw 0;
        } catch (o) {
            var n = 1;
            console.log(o, n);
        }
    }();
}
f();
