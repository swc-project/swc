const n = 42;
!(function() {
    var o = n;
    !(function(n) {
        console.log(n++, o);
    })(0);
})();
