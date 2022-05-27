function a() {
    function a() {
        return 1;
    }
    function b() {
        return 2;
    }
    a = function() {
        return 3;
    };
    return a() + b();
}
