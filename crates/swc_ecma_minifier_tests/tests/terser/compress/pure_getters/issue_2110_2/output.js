function f() {
    function f1() {
    }
    f1.g = function() {
        return this;
    };
    return f1.g();
}
console.log(typeof f());
