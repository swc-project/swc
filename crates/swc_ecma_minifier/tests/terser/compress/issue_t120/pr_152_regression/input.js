(function (root, factory) {
    root.CryptoJS = factory();
})(this, function () {
    var CryptoJS =
        CryptoJS ||
        (function (Math) {
            var C = {};
            C.demo = function (n) {
                return Math.ceil(n);
            };
            return C;
        })(Math);
    return CryptoJS;
});
var result = this.CryptoJS.demo(1.3);
console.log(result);
