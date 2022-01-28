(function () {
    console.log(1);
})();
(function (a) {
    console.log(a);
})(2);
(function (b) {
    var c = b;
    console.log(c);
})(3);
