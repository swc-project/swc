function a(a) {
    return function() {
        function b(a) {
            return a * a;
        }
        return [
            function() {
                function a(a) {
                    return a * a;
                }
                return a;
            },
            function() {
                function b(a) {
                    return a * a;
                }
                return a(b);
            }, 
        ];
    };
}
