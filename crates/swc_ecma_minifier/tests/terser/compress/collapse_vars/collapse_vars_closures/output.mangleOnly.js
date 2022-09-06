function n() {
    var n = 3;
    return function () {
        return n;
    };
}
function r(n) {
    var r = n;
    return function () {
        return r;
    };
}
