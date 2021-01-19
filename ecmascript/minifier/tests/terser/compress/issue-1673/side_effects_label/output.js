function f(x) {
    (function () {
        L: {
            console.log("PASS");
            break L;
        }
    })();
}
f(0);
