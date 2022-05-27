(function(x) {
    console.log(x() === eval("x"));
})(function a() {
    return a;
});
