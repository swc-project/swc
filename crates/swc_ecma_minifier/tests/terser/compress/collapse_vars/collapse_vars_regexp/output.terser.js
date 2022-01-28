function f1() {
    return [/[A-Z]+/, 9];
}
function f2() {
    var rx = /ab*/g;
    return function (s) {
        return rx.exec(s);
    };
}
(function () {
    var result,
        rx = /ab*/g;
    while ((result = rx.exec("acdabcdeabbb"))) console.log(result[0]);
})();
(function () {
    var result,
        rx = f2();
    while ((result = rx("acdabcdeabbb"))) console.log(result[0]);
})();
