function f() {
    function g() {}
    return !!(g = 0);
}
console.log(f());
