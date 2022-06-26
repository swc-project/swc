(function() {
    function a(a) {
        return a[a[0]];
    }
    function b() {
        if (true) {
            const b = a([
                1,
                2,
                3
            ]);
            console.log(b);
        }
    }
    return b();
})();
