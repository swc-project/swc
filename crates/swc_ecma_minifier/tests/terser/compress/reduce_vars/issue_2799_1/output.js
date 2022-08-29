console.log((function() {
    return function(n) {
        return function(j) {
            return function g(i) {
                return i && i + g(i - 1);
            }(j);
        }(n);
    };
})()(5));
