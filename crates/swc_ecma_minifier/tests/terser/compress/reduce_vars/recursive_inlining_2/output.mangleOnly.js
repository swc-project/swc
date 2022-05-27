!(function() {
    function a() {
        c();
    }
    function b() {
        a();
    }
    function c() {
        b();
    }
    console.log("PASS");
})();
