function n() {
    function n(n) {
        function r() {
            return n;
        }
        return function () {
            return r();
        };
    }
    return n("Hello");
}
console.log("Greeting:", n()());
