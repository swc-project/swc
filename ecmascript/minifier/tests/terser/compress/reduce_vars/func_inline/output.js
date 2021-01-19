function f() {
    console.log(1 + h());
    var h = function () {
        return 2;
    };
}
