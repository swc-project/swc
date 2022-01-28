function f() {
    var g = function () {
        return 1;
    };
    console.log(g() + h());
    var h = function () {
        return 2;
    };
}
