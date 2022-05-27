!(function() {
    function a() {
        b();
    }
    function b() {
        a();
    }
    console.log("PASS");
})();
