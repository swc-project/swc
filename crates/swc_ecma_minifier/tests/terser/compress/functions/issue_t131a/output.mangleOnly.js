(function() {
    function c() {
        return {
            a: 1
        };
    }
    function a() {
        return c();
    }
    function b() {
        var a = c();
        a.a = 2;
        a.b = 3;
        return a;
    }
    console.log(JSON.stringify(a()), JSON.stringify(b()));
})();
