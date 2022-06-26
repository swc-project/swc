(function(a, b) {
    a.CryptoJS = b();
})(this, function() {
    var a = a || (function(a) {
        var b = {};
        b.demo = function(b) {
            return a.ceil(b);
        };
        return b;
    })(Math);
    return a;
});
var a = this.CryptoJS.demo(1.3);
console.log(a);
