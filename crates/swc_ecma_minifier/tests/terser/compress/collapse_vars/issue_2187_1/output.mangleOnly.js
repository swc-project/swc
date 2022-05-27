var a = 1;
!(function(a) {
    a();
    var b = 2;
    console.log(b);
})(function() {
    console.log(a);
});
