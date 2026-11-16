function f(a) {
    (function () {
        try {
            var arguments = [9];
        } catch (e) {}
        console.log("inner", arguments[0]);
    })();
    console.log("outer", arguments[0]);
}
f(1);
