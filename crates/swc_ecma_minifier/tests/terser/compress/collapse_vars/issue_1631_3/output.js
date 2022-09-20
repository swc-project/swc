function g() {
    function f() {
        a = 2;
        return 4;
    }
    var a = 0, b = 1, t = f();
    return b = a + t;
}
console.log(g());
