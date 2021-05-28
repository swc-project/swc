function g() {
    var a = 0,
        b = 1;
    function f() {
        a = 2;
        return 4;
    }
    var t = f();
    b = a + t;
    return b;
}
console.log(g());
