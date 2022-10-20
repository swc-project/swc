function g() {
    var a = 0, b = 1, t = function f() {
        return a = 2, 4;
    }();
    return b = a + t;
}
console.log(g());
