function n() {
    var n = function () {
        return 1;
    };
    console.log(n() + o());
    var o = function () {
        return 2;
    };
}
