function f() {
    (function() {
        L: {
            console.log("PASS");
            break L;
        }
    })();
}
f();
