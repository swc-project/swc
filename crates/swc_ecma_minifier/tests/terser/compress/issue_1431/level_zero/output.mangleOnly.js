function a(a) {
    function b(a) {
        return a * a;
    }
    return function() {
        return a;
    };
}
