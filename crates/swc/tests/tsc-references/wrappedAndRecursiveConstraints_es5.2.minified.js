import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C(data) {
        swcHelpers.classCallCheck(this, C), this.data = data;
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}();
new C(null).foo(null);
