function f() {
    function f() {}
    function g() {
        return this;
    }
    f.g = g;
    return f.g();
}
console.log(typeof f());
