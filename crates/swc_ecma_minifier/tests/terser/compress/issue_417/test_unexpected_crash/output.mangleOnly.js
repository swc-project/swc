function a() {
    var a = function() {
        var a = 3;
        var b = 1 + 2 * a;
        console.log(a);
        console.log(b);
    };
    var b = a();
}
