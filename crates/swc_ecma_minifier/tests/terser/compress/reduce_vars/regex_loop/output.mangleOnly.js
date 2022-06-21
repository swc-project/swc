function a(a) {
    for(var b, c = "acdabcdeabbb"; (b = a().exec(c));)console.log(b[0]);
}
var b = /ab*/g;
a(function() {
    return b;
});
