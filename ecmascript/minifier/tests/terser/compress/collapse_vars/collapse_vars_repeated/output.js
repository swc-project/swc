function f1() {
    return -3;
}
function f2(x) {
    return x;
}
(function (x) {
    console.log("GOOD!!");
})(),
    (function (x) {
        console.log("GOOD!!");
    })();
