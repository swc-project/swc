function a(a) {
    function a() {
        return 1;
    }
    function b() {
        return 2;
    }
    function c() {
        return 3;
    }
    b.inject = [];
    c = function() {
        return 4;
    };
    return a() + b() + c();
}
