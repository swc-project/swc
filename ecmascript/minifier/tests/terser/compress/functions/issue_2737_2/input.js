(function (bar) {
    for (; bar(); ) break;
})(function qux() {
    return console.log("PASS"), qux;
});
