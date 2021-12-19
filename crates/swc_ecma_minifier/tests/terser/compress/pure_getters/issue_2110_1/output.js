function f() {
    function f1() {
    }
    return f1.g = function() {
        return this;
    }, f1.g();
}
console.log(typeof f());
