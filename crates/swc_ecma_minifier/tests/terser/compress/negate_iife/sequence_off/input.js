function f() {
    (function () {
        return t;
    })()
        ? console.log(true)
        : console.log(false);
    (function () {
        console.log("something");
    })();
}
function g() {
    (function () {
        console.log("something");
    })();
    (function () {
        return t;
    })()
        ? console.log(true)
        : console.log(false);
}
