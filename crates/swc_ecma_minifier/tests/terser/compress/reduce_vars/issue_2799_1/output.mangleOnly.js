console.log((function() {
    return a;
    function a(a) {
        function c(a) {
            return a && a + c(a - 1);
        }
        function b(a) {
            return c(a);
        }
        return b(a);
    }
})()(5));
