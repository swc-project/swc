function f() {
    function g() {
        return !!(g = 0);
    }
    return g();
}
console.log(f());
