function f() {
    function g() {}
    return (g = 0), false;
}
console.log(f());
