var a = function() {};
module.exports = (function() {
    var b = function() {
        "use strict";
        function b() {}
        return b.prototype.it = function() {
            this.bb = new b.MyA();
        }, b;
    }();
    return b.MyA = a, b;
})();
