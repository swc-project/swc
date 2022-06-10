(function() {
    console.log(1);
})();
(function(a) {
    console.log(a);
})(2);
(function(a) {
    var b = a;
    console.log(b);
})(3);
