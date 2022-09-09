function n() {
    console.log("x");
}
function o() {
    console.log("y");
}
function c() {
    console.log("z");
}
(function (n, o, c) {
    function l() {
        console.log("FAIL");
    }
    return l + o();
})(
    n(),
    function () {
        return o();
    },
    c()
);
