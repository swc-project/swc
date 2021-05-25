function f() {
    return (function g() {
        return (g = 0), !!g;
    })();
}
console.log(f());
