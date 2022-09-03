//// [bug25926.js]
var o1 = {
    a: function() {
        this.b = function(n) {
            return n;
        };
    }
}, o2 = {
    d: function() {
        var _this = this;
        this.e = this.f = function(m) {
            return _this.g || m;
        };
    }
};
