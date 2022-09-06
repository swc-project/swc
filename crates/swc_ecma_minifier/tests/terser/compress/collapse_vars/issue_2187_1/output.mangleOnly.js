var o = 1;
!(function (o) {
    o();
    var n = 2;
    console.log(n);
})(function () {
    console.log(o);
});
