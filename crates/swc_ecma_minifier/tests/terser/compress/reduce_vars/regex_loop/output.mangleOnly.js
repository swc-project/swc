function a(b) {
    for(var a, c = "acdabcdeabbb"; (a = b().exec(c));)console.log(a[0]);
}
var b = /ab*/g;
a(function() {
    return b;
});
