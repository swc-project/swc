function n(n) {
    for(var r, o = "acdabcdeabbb"; (r = n().exec(o));)console.log(r[0]);
}
var r = /ab*/g;
n(function() {
    return r;
});
