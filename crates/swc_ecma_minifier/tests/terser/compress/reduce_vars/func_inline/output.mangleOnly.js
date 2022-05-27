function a() {
    var a = function() {
        return 1;
    };
    console.log(a() + b());
    var b = function() {
        return 2;
    };
}
