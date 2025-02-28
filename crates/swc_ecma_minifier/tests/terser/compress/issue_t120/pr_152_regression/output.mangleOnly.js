(function(n, t) {
    n.CryptoJS = t();
})(this, function() {
    var n = n || (function(t) {
        var n = {};
        n.demo = function(n) {
            return t.ceil(n);
        };
        return n;
    })(Math);
    return n;
});
var n = this.CryptoJS.demo(1.3);
console.log(n);
