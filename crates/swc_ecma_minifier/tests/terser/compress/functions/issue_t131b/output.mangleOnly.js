(function() {
    function a() {
        return {
            a: 1
        };
    }
    function b() {
        return a();
    }
    function c() {
        var b = a();
        b.a = 2;
        b.b = 3;
        return b;
    }
    console.log(JSON.stringify(b()), JSON.stringify(c()));
})();
