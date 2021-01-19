function x() {
    console.log("x");
}
function y() {
    console.log("y");
}
function z() {
    console.log("z");
}
(function (a, b, c) {
    function y() {
        console.log("FAIL");
    }
    return y + b();
})(
    x(),
    function () {
        return y();
    },
    z()
);
