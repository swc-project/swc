console.log((function() {
    return a;
    function a(a) {
        function b(a) {
            return a && a + b(a - 1);
        }
        function c(a) {
            return b(a);
        }
        return c(a);
    }
})()(5));
