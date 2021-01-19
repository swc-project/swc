function g() {
    function f() {
        return (a = 2), 4;
    }
    var a = 0,
        b = 1,
        t = f();
    return (b = a + t);
}
console.log(g());
