var n = 42;
!(function(n) {
    console.log(n());
})(function(n) {
    return n;
});
