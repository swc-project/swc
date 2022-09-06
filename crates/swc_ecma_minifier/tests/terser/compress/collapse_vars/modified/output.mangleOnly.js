function n(n) {
    var r = n;
    return n + r;
}
function r(n) {
    var r = n;
    return n++ + r;
}
function t(n) {
    var r = n++;
    return n + r;
}
function u(n) {
    var r = n++;
    return n++ + r;
}
function o(n) {
    var r = (function () {
        return n;
    })();
    return n++ + r;
}
console.log(n(1), r(1), t(1), u(1), o(1));
