const n = "32";
!(function() {
    var o = n + 1;
    !(function(n) {
        console.log(o, n++);
    })(0);
})();
