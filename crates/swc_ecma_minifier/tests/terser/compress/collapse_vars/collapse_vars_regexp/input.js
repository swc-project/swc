function f1() {
    var k = 9;
    var rx = /[A-Z]+/;
    return [rx, k];
}
function f2() {
    var rx = /ab*/g;
    return function (s) {
        return rx.exec(s);
    };
}
(function () {
    var result;
    var s = "acdabcdeabbb";
    var rx = /ab*/g;
    while ((result = rx.exec(s))) {
        console.log(result[0]);
    }
})();
(function () {
    var result;
    var s = "acdabcdeabbb";
    var rx = f2();
    while ((result = rx(s))) {
        console.log(result[0]);
    }
})();
