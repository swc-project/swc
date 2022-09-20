function f() {
    function f() {}
    f.g = function() {
        return this;
    };
    return f.g();
}
console.log(typeof f());
