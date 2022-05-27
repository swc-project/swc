(function(a, b) {
    a.CryptoJS = b();
})(this, function() {
    var a = a || (function(b) {
        var a = {};
        a.demo = function(a) {
            return b.ceil(a);
        };
        return a;
    })(Math);
    return a;
});
var a = this.CryptoJS.demo(1.3);
console.log(a);
