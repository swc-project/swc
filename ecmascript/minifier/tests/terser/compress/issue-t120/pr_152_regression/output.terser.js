(function (root, factory) {
    var CryptoJS;
    root.CryptoJS = CryptoJS =
        CryptoJS ||
        (function (Math) {
            var C = {
                demo: function (n) {
                    return Math.ceil(n);
                },
            };
            return C;
        })(Math);
})(this);
var result = this.CryptoJS.demo(1.3);
console.log(result);
