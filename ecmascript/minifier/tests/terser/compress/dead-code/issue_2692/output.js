function f(a) {
    return (a = g);
    function g() {
        return a;
    }
}
console.log(typeof f()());
