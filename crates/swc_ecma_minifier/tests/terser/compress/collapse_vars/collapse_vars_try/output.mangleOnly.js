function a() {
    try {
        var a = 1;
        return a;
    } catch (b) {
        var c = 2;
        return c;
    } finally{
        var d = 3;
        return d;
    }
}
function b() {
    var a = could_throw();
    try {
        return a + might_throw();
    } catch (b) {
        return 3;
    }
}
