function a(a) {
    !(function() {
        try {
            throw 0;
        } catch (a) {
            var b = 1;
            console.log(a, b);
        }
    })();
}
a();
