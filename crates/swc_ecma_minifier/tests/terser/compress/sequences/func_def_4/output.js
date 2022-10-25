function f() {
    function g() {
        return g = 0, false;
    }
    return g();
}
console.log(f());
