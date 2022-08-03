(function(n, r) {
    n.CryptoJS = r();
})(this, function() {
    var n = n || (function(n) {
        var r = {};
        r.demo = function(r) {
            return n.ceil(r);
        };
        return r;
    })(Math);
    return n;
});
var n = this.CryptoJS.demo(1.3);
console.log(n);
