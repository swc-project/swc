function a(a) {
    return function() {
        function b(a) {
            return a * a;
        }
        return function() {
            function b(a) {
                return a * a;
            }
            return a(b);
        };
    };
}
