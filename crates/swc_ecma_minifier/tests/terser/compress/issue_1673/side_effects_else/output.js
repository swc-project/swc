function f(x) {
    (function() {
        x || console.log("PASS");
    })();
}
f(0);
