function f() {
    function g() {
        return (g = 0), !!g;
    }
    return g();
}
console.log(f());
