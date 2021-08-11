function f() {
    return g(2);
    function g(b) {
        return b;
    }
}

console.log(f())