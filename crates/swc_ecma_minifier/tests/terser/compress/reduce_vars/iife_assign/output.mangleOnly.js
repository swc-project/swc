!(function() {
    var a = 1, b = 0;
    !(function() {
        b++;
        return;
        a = 2;
    })();
    console.log(a);
})();
