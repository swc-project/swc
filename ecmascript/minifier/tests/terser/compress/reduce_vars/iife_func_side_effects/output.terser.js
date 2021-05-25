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
    return (
        function () {
            console.log("FAIL");
        } + b()
    );
})(
    x(),
    function () {
        return y();
    },
    z()
);
