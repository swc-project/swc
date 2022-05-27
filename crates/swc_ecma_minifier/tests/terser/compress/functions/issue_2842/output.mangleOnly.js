(function() {
    function b(a) {
        return a[a[0]];
    }
    function a() {
        if (true) {
            const a = b([
                1,
                2,
                3
            ]);
            console.log(a);
        }
    }
    return a();
})();
