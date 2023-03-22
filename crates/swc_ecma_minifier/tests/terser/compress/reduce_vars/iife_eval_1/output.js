(function(x) {
    console.log(x() === eval("x"));
})(function f1() {
    return f1;
});
