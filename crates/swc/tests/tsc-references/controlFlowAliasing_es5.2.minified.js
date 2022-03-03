function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var C10 = function(x) {
    "use strict";
    _classCallCheck(this, C10), this.x = x, "string" == typeof this.x && "string" == typeof x && this.x;
}, C11 = function(x) {
    "use strict";
    _classCallCheck(this, C11), this.x = x, "string" == typeof this.x && "string" == typeof x ? (this.x, x) : (this.x = 10, x = 10);
};
({
    fn: function() {
        return !0;
    }
}).fn();
