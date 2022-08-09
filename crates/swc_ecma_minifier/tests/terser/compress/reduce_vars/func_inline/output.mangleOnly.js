function n() {
    var n = function() {
        return 1;
    };
    console.log(n() + r());
    var r = function() {
        return 2;
    };
}
