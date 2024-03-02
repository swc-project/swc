var a = /ab*/g;
(function(x) {
    for(var r; r = x().exec("acdabcdeabbb");)console.log(r[0]);
})(function() {
    return a;
});
