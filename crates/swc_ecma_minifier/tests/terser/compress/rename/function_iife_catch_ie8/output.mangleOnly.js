function t(t) {
    !(function() {
        try {
            throw 0;
        } catch (t) {
            var c = 1;
            console.log(t, c);
        }
    })();
}
t();
