function a() {
    function a() {}
    a.a = function() {};
    a.b = a.a;
    return a;
}
