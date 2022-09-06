(function (n, t) {
    n.CryptoJS = t();
})(this, function () {
    var n =
        n ||
        (function (n) {
            var t = {};
            t.demo = function (t) {
                return n.ceil(t);
            };
            return t;
        })(Math);
    return n;
});
var n = this.CryptoJS.demo(1.3);
console.log(n);
