(function () {
    console.log(1);
})();
(function (o) {
    console.log(o);
})(2);
(function (o) {
    var n = o;
    console.log(n);
})(3);
