function a() {
    var a = 9;
    var n = /[A-Z]+/;
    return [n, a];
}
function n() {
    var a = /ab*/g;
    return function (n) {
        return a.exec(n);
    };
}
(function () {
    var a;
    var n = "acdabcdeabbb";
    var r = /ab*/g;
    while ((a = r.exec(n))) {
        console.log(a[0]);
    }
})();
(function () {
    var a;
    var r = "acdabcdeabbb";
    var c = n();
    while ((a = c(r))) {
        console.log(a[0]);
    }
})();
