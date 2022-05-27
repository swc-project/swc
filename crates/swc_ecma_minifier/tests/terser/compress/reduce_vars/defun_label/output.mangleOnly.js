!(function() {
    function a(a) {
        L: {
            if (a) break L;
            return 1;
        }
    }
    console.log(a(2));
})();
