(function (A) {
    (function () {
        doPrint();
    })();
    function doPrint() {
        print(A);
    }
})("Hello World!");
function print(A) {
    if (!A.x) {
        console.log(A);
    }
}
