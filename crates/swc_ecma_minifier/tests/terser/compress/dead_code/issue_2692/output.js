function f(a) {
    function g() {
        return a;
    }
    return a = g;
}
console.log(typeof f()());
