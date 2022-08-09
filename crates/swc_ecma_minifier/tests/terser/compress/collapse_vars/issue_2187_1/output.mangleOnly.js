var n = 1;
!(function(n) {
    n();
    var o = 2;
    console.log(o);
})(function() {
    console.log(n);
});
