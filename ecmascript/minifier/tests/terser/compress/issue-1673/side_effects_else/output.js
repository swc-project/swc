function f(x) {
    (function () {
        if (x);
        else console.log("PASS");
    })();
}
f(0);
