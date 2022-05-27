function a() {
    var b = 0, a = 1;
    function c() {
        b = 2;
        return 4;
    }
    var d = c();
    a = b + d;
    return a;
}
console.log(a());
