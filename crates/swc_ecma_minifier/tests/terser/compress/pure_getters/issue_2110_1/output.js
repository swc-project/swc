function f() {
    function f() {}
    return f.g = function() {
        return this;
    }, f.g();
}
console.log(typeof f());
