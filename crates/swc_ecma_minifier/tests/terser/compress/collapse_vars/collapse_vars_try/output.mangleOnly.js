function a() {
    try {
        var a = 1;
        return a;
    } catch (d) {
        var b = 2;
        return b;
    } finally{
        var c = 3;
        return c;
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
