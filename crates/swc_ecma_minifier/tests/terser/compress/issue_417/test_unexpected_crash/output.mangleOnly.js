function a() {
    var a = function() {
        var a = 3;
        var n = 1 + 2 * a;
        console.log(a);
        console.log(n);
    };
    var n = a();
}
